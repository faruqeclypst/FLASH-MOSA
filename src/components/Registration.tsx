import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent, Registration, Competition, SchoolCategory } from '../types';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User, Mail, School, Award, Phone, Calendar, MapPin, FileText, Upload } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegistrationAlert from './RegistrationAlert';

const RegistrationForm: React.FC = () => {
  const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');
  const { pushData: pushRegistration, getLatestRegistrationCode } = useFirebase<Registration>('registrations');
  const storage = getStorage();

  const [selectedCategory, setSelectedCategory] = useState<SchoolCategory | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [formData, setFormData] = useState<Partial<Registration>>({});
  const [teamMembers, setTeamMembers] = useState<string[]>(['']);
  const [ktsSuratAktifFile, setKtsSuratAktifFile] = useState<File | null>(null);
  const [buktiPembayaranFile, setBuktiPembayaranFile] = useState<File | null>(null);
  const [teamSize, setTeamSize] = useState<number>(2);
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schoolCategories: SchoolCategory[] = ['SD/MI', 'SMP/MTs', 'SMA/SMK/MA', 'UMUM'];
  const acehCities = [
    'Banda Aceh', 'Sabang', 'Lhokseumawe', 'Langsa', 'Meulaboh',
    'Bireuen', 'Takengon', 'Blangpidie', 'Calang', 'Jantho',
    'Sigli', 'Singkil', 'Subulussalam', 'Suka Makmue', 'Tapaktuan'
  ];

  useEffect(() => {
    if (selectedCompetition) {
      setFormData({});
      setTeamMembers(['']);
      setKtsSuratAktifFile(null);
      setBuktiPembayaranFile(null);
      setTeamSize(selectedCompetition.teamSize || 2);
    }
  }, [selectedCompetition]);

  const generateRegistrationCode = async () => {
    const latestCode = await getLatestRegistrationCode();
    const currentNumber = parseInt(latestCode.split('#')[1], 10);
    const nextNumber = (currentNumber + 1) % 10000; // Wrap around to 0000 after 9999
    return `FLASH#${nextNumber.toString().padStart(4, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateFile = (file: File) => {
    const maxSize = 500 * 1024; // 500KB dalam bytes
    if (file.size > maxSize) {
      toast.error('File terlalu besar! Maksimal 500KB');
      return false;
    }
    if (file.type !== 'application/pdf') {
      toast.error('File harus berformat PDF');
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        if (e.target.name === 'ktsSuratAktif') {
          setKtsSuratAktifFile(file);
        } else if (e.target.name === 'buktiPembayaran') {
          setBuktiPembayaranFile(file);
        }
      } else {
        e.target.value = ''; // Reset input file jika validasi gagal
      }
    }
  };

  const handleTeamMemberChange = (index: number, value: string) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers[index] = value;
    setTeamMembers(newTeamMembers);
    setFormData({ ...formData, teamMembers: newTeamMembers });
  };

  const addTeamMember = () => {
    if (teamMembers.length < teamSize) {
      setTeamMembers([...teamMembers, '']);
    }
  };

  const removeTeamMember = (index: number) => {
    const newTeamMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(newTeamMembers);
    setFormData({ ...formData, teamMembers: newTeamMembers });
  };

  const uploadFile = async (file: File, path: string) => {
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions

    try {
      setIsSubmitting(true); // Set submitting state to true

      let ktsSuratAktifUrl = '';
      let buktiPembayaranUrl = '';
  
      if (ktsSuratAktifFile) {
        ktsSuratAktifUrl = await uploadFile(ktsSuratAktifFile, `kts_surat_aktif/${Date.now()}_${ktsSuratAktifFile.name}`);
      }
  
      if (buktiPembayaranFile) {
        buktiPembayaranUrl = await uploadFile(buktiPembayaranFile, `bukti_pembayaran/${Date.now()}_${buktiPembayaranFile.name}`);
      }
  
      const registrationCode = await generateRegistrationCode();
      const registrationDate = new Date().toISOString();
  
      const registrationData: Registration = {
        ...formData,
        competition: selectedCompetition?.name || '',
        status: 'pending',
        ktsSuratAktif: ktsSuratAktifUrl,
        buktiPembayaran: buktiPembayaranUrl,
        registrationCode,
        registrationDate,
        schoolCategory: selectedCategory || 'UMUM',
      } as Registration;
  
      await pushRegistration(registrationData);
      setShowAlert(true);
      setFormData({});
      setTeamMembers(['']);
      setSelectedCompetition(null);
      setSelectedCategory(null);
      setKtsSuratAktifFile(null);
      setBuktiPembayaranFile(null);
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('Error submitting registration. Please try again.');
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };

  if (!flashEvent) return <div className="text-center py-8">Loading...</div>;

  const isTeam = selectedCompetition?.type === 'team';

  return (
    <section id="registration" className="py-16 md:py-20 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <RegistrationAlert isOpen={showAlert} onClose={() => setShowAlert(false)} />
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
                <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-5xl font-extrabold mb-4 text-gray-800 leading-tight">
            Pendaftaran <span className="text-blue-600">Lomba</span>
          </h2>
          <div className="bg-blue-600 w-24 h-2 mb-8 mx-auto rounded-full"></div>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            FLASH {new Date().getFullYear()}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="mx-auto bg-white shadow-2xl rounded-lg p-4 md:p-8"
          variants={itemVariants}
        >
          <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
              Pilih Kategori
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={selectedCategory || ''}
                onChange={(e) => {
                  setSelectedCategory(e.target.value as SchoolCategory);
                  setSelectedCompetition(null);
                }}
                required
                className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 appearance-none"
              >
                <option value="">Select a category</option>
                {schoolCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <School className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {selectedCategory && (
            <motion.div 
              className="mb-4 md:mb-6" 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <label htmlFor="competition" className="block text-gray-700 text-sm font-bold mb-2">
                Pilih Lomba
              </label>
              <div className="relative">
                <select
                  id="competition"
                  name="competition"
                  value={selectedCompetition?.name || ''}
                  onChange={(e) => {
                    const selected = flashEvent.competitions.find(
                      (c) => c.name === e.target.value && c.categories?.includes(selectedCategory)
                    );
                    setSelectedCompetition(selected || null);
                  }}
                  required
                  className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 appearance-none bg-white"
                >
                  <option value="">Select a competition</option>
                  {flashEvent.competitions
                    .filter((competition) => competition.categories?.includes(selectedCategory))
                    .map((competition, index) => (
                      <option key={index} value={competition.name}>
                        {competition.name}
                      </option>
                    ))}
                </select>
                <Award className="absolute left-3 top-2 md:top-3 text-gray-400 pointer-events-none" size={20} />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          )}

          {selectedCompetition && (
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            >
              {/* Column 1 */}
              <div>
                {isTeam ? (
                  <>
                    <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                      <label htmlFor="registrantName" className="block text-gray-700 text-sm font-bold mb-2">
                        Nama Pendaftar
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="registrantName"
                          name="registrantName"
                          value={formData.registrantName || ''}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        />
                        <User className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                      </div>
                    </motion.div>
                    <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                      <label htmlFor="teamName" className="block text-gray-700 text-sm font-bold mb-2">
                        Nama Tim
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="teamName"
                          name="teamName"
                          value={formData.teamName || ''}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                          />
                          <User className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                          Nama Lengkap
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                          />
                          <User className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                        </div>
                      </motion.div>
                      <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                        <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
                          Jenis Kelamin
                        </label>
                        <div className="relative">
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 appearance-none"
                          >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                          </select>
                          <User className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                              className="fill-current h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                        <label htmlFor="birthDate" className="block text-gray-700 text-sm font-bold mb-2">
                          Tanggal Lahir
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            value={formData.birthDate || ''}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                          />
                          <Calendar className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
  
                {/* Column 2 */}
                <div>
                  <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                    <label htmlFor="whatsapp" className="block text-gray-700 text-sm font-bold mb-2">
                      No. WhatsApp
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp || ''}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                      />
                      <Phone className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                    </div>
                  </motion.div>
  
                  <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                      />
                      <Mail className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                    </div>
                  </motion.div>
  
                  {selectedCategory !== 'UMUM' && (
                    <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                      <label htmlFor="school" className="block text-gray-700 text-sm font-bold mb-2">
                        Nama Sekolah
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="school"
                          name="school"
                          value={formData.school || ''}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        />
                        <School className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                      </div>
                    </motion.div>
                  )}
                </div>
  
                {/* Column 3 */}
                <div>
                  <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                    <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
                      Kota/Kabupaten
                    </label>
                    <div className="relative">
                      <select
                        id="city"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 appearance-none"
                      >
                        <option value="">Pilih Kota/Kabupaten</option>
                        {acehCities.map((city, index) => (
                          <option key={index} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      <MapPin className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
  
                  {selectedCategory !== 'UMUM' && (
                    <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                      <label htmlFor="ktsSuratAktif" className="block text-gray-700 text-sm font-bold mb-2">
                        KTS / Surat Aktif (PDF)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="ktsSuratAktif"
                          name="ktsSuratAktif"
                          onChange={handleFileChange}
                          accept=".pdf"
                          required
                          className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                        />
                        <FileText className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                      </div>
                    </motion.div>
                  )}
  
                  <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                    <label htmlFor="buktiPembayaran" className="block text-gray-700 text-sm font-bold mb-2">
                      Bukti Pembayaran (PDF)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="buktiPembayaran"
                        name="buktiPembayaran"
                        onChange={handleFileChange}
                        accept=".pdf"
                        required
                        className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                      />
                      <Upload className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                    </div>
                  </motion.div>
                </div>
  
                {/* Team Members section (if applicable) */}
                {isTeam && (
                  <motion.div className="col-span-1 md:col-span-3 mt-4 md:mt-6" variants={itemVariants}>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Anggota Tim (Maksimum {teamSize} anggota)
                    </label>
                    {teamMembers.map((member, index) => (
                      <div key={index} className="flex mb-2">
                        <div className="relative flex-grow">
                          <input
                            type="text"
                            value={member}
                            onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                            className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                            placeholder={`Nama Anggota ${index + 1}`}
                          />
                          <User className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                        </div>
                        {index > 0 && (
                          <motion.button
                            type="button"
                            onClick={() => removeTeamMember(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded ml-2 hover:bg-red-600 transition duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Hapus
                          </motion.button>
                        )}
                      </div>
                    ))}
                    {teamMembers.length < teamSize && (
                      <motion.button
                        type="button"
                        onClick={addTeamMember}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-300 mt-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Tambah Anggota
                      </motion.button>
                    )}
                  </motion.div>
                )}
  
                {/* Submit button */}
                <motion.div className="col-span-1 md:col-span-3 mt-6" variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full ${
                      isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white py-2 md:py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105`}
                    whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.80 }}
                  >
                    {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </motion.form>
        </motion.div>
      </section>
    );
  };
  
  export default RegistrationForm;