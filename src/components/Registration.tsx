import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent, Registration, Competition } from '../types';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User, Mail, School, Award, Phone, Calendar, MapPin, FileText, Upload } from 'lucide-react';

const RegistrationForm: React.FC = () => {
  const { data: flashEvent } = useFirebase<FlashEvent>('flashEvent');
  const { pushData } = useFirebase<Registration>('registrations');
  const storage = getStorage();

  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [formData, setFormData] = useState<Partial<Registration>>({});
  const [teamMembers, setTeamMembers] = useState<string[]>(['']);
  const [ktsSuratAktifFile, setKtsSuratAktifFile] = useState<File | null>(null);
  const [buktiPembayaranFile, setBuktiPembayaranFile] = useState<File | null>(null);

  const schoolCategories = ['SD', 'SMP', 'SMA', 'Umum'];
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
    }
  }, [selectedCompetition]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.name === 'ktsSuratAktif') {
        setKtsSuratAktifFile(e.target.files[0]);
      } else if (e.target.name === 'buktiPembayaran') {
        setBuktiPembayaranFile(e.target.files[0]);
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
    setTeamMembers([...teamMembers, '']);
  };

  const removeTeamMember = (index: number) => {
    const newTeamMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(newTeamMembers);
    setFormData({ ...formData, teamMembers: newTeamMembers });
  };

  const uploadFile = async (file: File, path: string) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let ktsSuratAktifUrl = '';
      let buktiPembayaranUrl = '';

      if (ktsSuratAktifFile) {
        ktsSuratAktifUrl = await uploadFile(ktsSuratAktifFile, `kts_surat_aktif/${Date.now()}_${ktsSuratAktifFile.name}`);
      }

      if (buktiPembayaranFile) {
        buktiPembayaranUrl = await uploadFile(buktiPembayaranFile, `bukti_pembayaran/${Date.now()}_${buktiPembayaranFile.name}`);
      }

      const registrationData: Registration = {
        ...formData,
        competition: selectedCompetition?.name || '',
        status: 'pending',
        ktsSuratAktif: ktsSuratAktifUrl,
        buktiPembayaran: buktiPembayaranUrl,
      } as Registration;

      await pushData(registrationData);
      alert('Registration submitted successfully!');
      setFormData({});
      setTeamMembers(['']);
      setSelectedCompetition(null);
      setKtsSuratAktifFile(null);
      setBuktiPembayaranFile(null);
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Error submitting registration. Please try again.');
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
    <section className="py-12 md:py-24 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-4xl md:text-6xl font-bold mb-4 md:mb-8 text-center text-gray-800 leading-tight"
          variants={itemVariants}
        >
          Register for a Competition
        </motion.h2>
        <div className="bg-blue-600 w-24 h-2 mb-8 md:mb-16 mx-auto"></div>

        <motion.form
          onSubmit={handleSubmit}
          className="max-w-6xl mx-auto bg-white shadow-2xl rounded-lg p-4 md:p-8"
          variants={itemVariants}
        >
          <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
            <label htmlFor="competition" className="block text-gray-700 text-sm font-bold mb-2">
              Competition
            </label>
            <div className="relative">
              <select
                id="competition"
                name="competition"
                value={selectedCompetition?.name || ''}
                onChange={(e) => {
                  const selected = flashEvent.competitions.find(
                    (c) => c.name === e.target.value
                  );
                  setSelectedCompetition(selected || null);
                }}
                required
                className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 appearance-none"
              >
                <option value="">Select a competition</option>
                {flashEvent.competitions.map((competition, index) => (
                  <option key={index} value={competition.name}>
                    {competition.name}
                  </option>
                ))}
              </select>
              <Award className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
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

                <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                  <label htmlFor="schoolCategory" className="block text-gray-700 text-sm font-bold mb-2">
                    Kategori Sekolah
                  </label>
                  <div className="relative">
                    <select
                      id="schoolCategory"
                      name="schoolCategory"
                      value={formData.schoolCategory || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 md:py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 appearance-none"
                    >
                      <option value="">Pilih Kategori Sekolah</option>
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
              </div>

              {/* Column 3 */}
              <div>
                {formData.schoolCategory !== 'Umum' && (
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

                {formData.schoolCategory !== 'Umum' && (
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
                    Anggota Tim
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
                  <motion.button
                    type="button"
                    onClick={addTeamMember}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-300 mt-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Tambah Anggota
                  </motion.button>
                </motion.div>
              )}

              {/* Submit button */}
              <motion.div className="col-span-1 md:col-span-3 mt-6" variants={itemVariants}>
                <motion.button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 md:py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Daftar Sekarang
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