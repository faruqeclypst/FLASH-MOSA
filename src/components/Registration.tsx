import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFirebase } from '../hooks/useFirebase';
import { FlashEvent, Registration, Competition, SchoolCategory } from '../types';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User, Mail, School, Award, Phone, Calendar, MapPin, FileText, Upload, Plus } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegistrationAlert from './RegistrationAlert';
import BSILogo from '../assets/img/BSI.png';

const isValidSchoolCategory = (category: string): category is SchoolCategory => {
  return ['SD/MI', 'SMP/MTs', 'SMA/SMK/MA', 'UMUM'].includes(category);
};

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
  const [registrationData, setRegistrationData] = useState<Registration | undefined>();
  const [pasPhotoFiles, setPasPhotoFiles] = useState<(File | null)[]>([null]);

  const schoolCategories: SchoolCategory[] = ['SD/MI', 'SMP/MTs', 'SMA/SMK/MA', 'UMUM'];
  const acehCities = [
    'KOTA BANDA ACEH',
    'KOTA SABANG',
    'KOTA LHOKSEUMAWE',
    'KOTA LANGSA',
    'KOTA SUBULUSSALAM',
    'KABUPATEN ACEH BESAR',
    'KABUPATEN PIDIE',
    'KABUPATEN PIDIE JAYA',
    'KABUPATEN BIREUEN',
    'KABUPATEN ACEH TENGAH',
    'KABUPATEN BENER MERIAH',
    'KABUPATEN ACEH UTARA',
    'KABUPATEN ACEH TIMUR',
    'KABUPATEN ACEH TAMIANG',
    'KABUPATEN ACEH SINGKIL',
    'KABUPATEN ACEH JAYA',
    'KABUPATEN ACEH BARAT',
    'KABUPATEN NAGAN RAYA',
    'KABUPATEN SIMEULUE',
    'KABUPATEN ACEH BARAT DAYA',
    'KABUPATEN ACEH SELATAN',
    'KABUPATEN ACEH TENGGARA',
    'KABUPATEN GAYO LUES',
    'LUAR DAERAH'
  ];

  useEffect(() => {
    if (selectedCompetition) {
      setFormData({});
      setTeamMembers(['']);
      setKtsSuratAktifFile(null);
      setBuktiPembayaranFile(null);
      
      if (selectedCompetition.type === 'team' && selectedCompetition.requirePassportPhoto) {
        setPasPhotoFiles(new Array(selectedCompetition.teamSize || 2).fill(null));
      } else {
        setPasPhotoFiles([null]);
      }
      
      setTeamSize(selectedCompetition.teamSize || 2);
    }
  }, [selectedCompetition]);

  useEffect(() => {
    const handleCompetitionSelect = (event: CustomEvent) => {
      const { competition: competitionName, category, shouldScroll } = event.detail;
      
      if (competitionName && category && flashEvent?.competitions) {
        if (isValidSchoolCategory(category)) {
          setSelectedCategory(category);
          
          const competition = flashEvent.competitions.find(
            c => c.name === competitionName && 
                 c.categories?.includes(category) &&
                 c.isActive
          );
          
          if (competition) {
            setSelectedCompetition(competition);
            
            if (shouldScroll) {
              const registrationSection = document.getElementById('registration');
              if (registrationSection) {
                setTimeout(() => {
                  registrationSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }, 100);
              }
            }
          }
        }
      }
    };

    // Add event listener for custom event
    window.addEventListener('competitionSelected', handleCompetitionSelect as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('competitionSelected', handleCompetitionSelect as EventListener);
    };
  }, [flashEvent?.competitions]);

  const generateRegistrationCode = async () => {
    const latestCode = await getLatestRegistrationCode();
    const currentNumber = parseInt(latestCode.split('#')[1], 10);
    const nextNumber = (currentNumber + 1) % 10000; // Wrap around to 0000 after 9999
    return `FLASH#${nextNumber.toString().padStart(4, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'whatsapp') {
      // Remove any non-digit characters
      let value = e.target.value.replace(/\D/g, '');
      
      // Remove leading zeros if any
      if (value.startsWith('0')) {
        value = value.substring(1);
      }
      
      // Add +62 prefix if not already present
      if (!value.startsWith('62')) {
        value = '62' + value;
      }
      
      // Add + symbol at the start
      value = '+' + value;
      
      setFormData({ ...formData, whatsapp: value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateFile = (file: File) => {
    const maxSize = 500 * 1024; // 500KB dalam bytes
    if (file.size > maxSize) {
      toast.error('File terlalu besar! Maksimal 500KB');
      return false;
    }
    
    // Check file type based on input name
    if (file.name.endsWith('.pdf')) {
      if (file.type !== 'application/pdf') {
        toast.error('File harus berformat PDF');
        return false;
      }
    } else {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('File harus berformat JPG atau PNG');
        return false;
      }
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, memberIndex?: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        if (e.target.name === 'ktsSuratAktif') {
          setKtsSuratAktifFile(file);
        } else if (e.target.name === 'buktiPembayaran') {
          setBuktiPembayaranFile(file);
        } else if (e.target.name === 'pasPhoto') {
          if (typeof memberIndex === 'number') {
            const newPasPhotoFiles = [...pasPhotoFiles];
            newPasPhotoFiles[memberIndex] = file;
            setPasPhotoFiles(newPasPhotoFiles);
          } else {
            setPasPhotoFiles([file]);
          }
        }
      } else {
        e.target.value = '';
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
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      let ktsSuratAktifUrl = '';
      let buktiPembayaranUrl = '';
      let pasPhotoUrls: string[] = [];

      if (ktsSuratAktifFile) {
        ktsSuratAktifUrl = await uploadFile(ktsSuratAktifFile, `kts_surat_aktif/${Date.now()}_${ktsSuratAktifFile.name}`);
      }

      if (buktiPembayaranFile) {
        buktiPembayaranUrl = await uploadFile(buktiPembayaranFile, `bukti_pembayaran/${Date.now()}_${buktiPembayaranFile.name}`);
      }

      if (selectedCompetition?.requirePassportPhoto) {
        for (let i = 0; i < pasPhotoFiles.length; i++) {
          const file = pasPhotoFiles[i];
          if (file) {
            const url = await uploadFile(file, `pas_foto/${Date.now()}_${i + 1}_${file.name}`);
            pasPhotoUrls.push(url);
          }
        }
      }

      const registrationCode = await generateRegistrationCode();
      const registrationDate = new Date().toISOString();

      const newRegistrationData: Registration = {
        ...formData,
        competition: selectedCompetition?.name || '',
        status: 'pending',
        ktsSuratAktif: ktsSuratAktifUrl,
        buktiPembayaran: buktiPembayaranUrl,
        ...(selectedCompetition?.requirePassportPhoto && {
          pasPhoto: isTeam ? pasPhotoUrls.join(',') : pasPhotoUrls[0]
        }),
        registrationCode,
        registrationDate,
        schoolCategory: selectedCategory || 'UMUM',
      } as Registration;

      await pushRegistration(newRegistrationData);
      setRegistrationData(newRegistrationData);
      setShowAlert(true);
      
      // Reset form
      setFormData({});
      setTeamMembers(['']);
      setSelectedCompetition(null);
      setSelectedCategory(null);
      setKtsSuratAktifFile(null);
      setBuktiPembayaranFile(null);
      setPasPhotoFiles([null]);
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('Error submitting registration. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  if (!flashEvent) return <div className="text-center py-8">Load Flash!</div>;

  const isTeam = selectedCompetition?.type === 'team';

  console.log('Selected Competition:', selectedCompetition);
  console.log('Require Passport Photo:', selectedCompetition?.requirePassportPhoto);

  return (
    <section id="registration" className="py-16 md:py-20 bg-gradient-to-b from-gray-100 to-white overflow-hidden">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <RegistrationAlert 
        isOpen={showAlert} 
        onClose={() => setShowAlert(false)}
        registrationData={registrationData}
      />
      
      <motion.form
        onSubmit={handleSubmit}
        className="container mx-auto px-4"
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl font-extrabold mb-4 text-gray-800 leading-tight font-antistar">
            Pendaftaran <span className="text-emerald-800">Lomba</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            FLASH CELESTIANCE {new Date().getFullYear()}
          </p>
        </motion.div>

        <div className="mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
          <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
            <label htmlFor="category" className="block text-gray-700 text-base font-bold mb-2">
              Pilih Kategori
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={selectedCategory || ''}
                onChange={(e) => {
                  const newCategory = e.target.value as SchoolCategory;
                  setSelectedCategory(newCategory);
                  setSelectedCompetition(null);
                }}
                required
                className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300 appearance-none"
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
              <label htmlFor="competition" className="block text-gray-700 text-base font-bold mb-2">
                Pilih Lomba
              </label>
              <div className="relative">
                <select
                  id="competition"
                  name="competition"
                  value={selectedCompetition?.name || ''}
                  onChange={(e) => {
                    const selected = flashEvent?.competitions.find(
                      (c) => c.name === e.target.value && 
                             c.categories?.includes(selectedCategory || '') &&
                             c.isActive
                    );
                    
                    // Reset form data when competition changes
                    setFormData({});
                    setTeamMembers(['']);
                    setKtsSuratAktifFile(null);
                    setBuktiPembayaranFile(null);
                    
                    if (selected) {
                      setSelectedCompetition(selected); // Langsung set selected competition
                      
                      // Initialize team members if it's a team competition
                      if (selected.type === 'team') {
                        setTeamMembers(new Array(selected.teamSize || 2).fill(''));
                      }
                      
                      // Initialize pas photo files if required
                      if (selected.requirePassportPhoto) {
                        if (selected.type === 'team') {
                          setPasPhotoFiles(new Array(selected.teamSize || 2).fill(null));
                        } else {
                          setPasPhotoFiles([null]);
                        }
                      }
                    } else {
                      setSelectedCompetition(null);
                    }
                  }}
                  required
                  className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300 appearance-none bg-white"
                >
                  <option value="">Select a competition</option>
                  {flashEvent?.competitions
                    .filter((competition) => {
                      const today = new Date();
                      const endDate = new Date(flashEvent.registrationPeriod.endDate);
                      const startDate = new Date(flashEvent.registrationPeriod.startDate);
                      
                      return competition.categories?.includes(selectedCategory || '') &&
                             competition.isActive &&
                             today >= startDate &&
                             today <= endDate;
                    })
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
            <>
              <motion.div 
                className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Biaya Pendaftaran</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {selectedCompetition.type === 'team' ? 'Per Tim' : 'Per Orang'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900">
                      {selectedCompetition.registrationFee ? (
                        `Rp ${selectedCompetition.registrationFee.toLocaleString('id-ID')}`
                      ) : (
                        'Gratis'
                      )}
                    </span>
                  </div>
                </div>

                {selectedCompetition.registrationFee > 0 && (
                  <>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                      <img 
                        src={BSILogo}
                        alt="Bank BSI" 
                        className="h-8 object-contain"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Bank Syariah Indonesia (BSI)</p>
                        <p className="text-sm text-gray-600">Pembayaran hanya melalui BSI</p>
                      </div>
                    </div>

                    {selectedCompetition.bankAccount && (
                      <div className="mt-2 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm text-gray-500">Nomor Rekening</p>
                            <p className="text-base font-medium text-gray-900">
                              {selectedCompetition.bankAccount.number}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Atas Nama</p>
                            <p className="text-base font-medium text-gray-900">
                              {selectedCompetition.bankAccount.holder}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>

              {selectedCompetition.registrationFee > 0 && (
                <motion.div 
                  className="mb-6 p-4 bg-yellow-50 rounded-lg"
                  variants={itemVariants}
                >
                  <h5 className="font-medium text-yellow-800 mb-2">Catatan Pembayaran:</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                    <li>Mohon transfer sesuai nominal yang tertera</li>
                    <li>Simpan bukti pembayaran</li>
                    <li>Upload bukti pembayaran pada form di bawah</li>
                    <li>Pembayaran hanya diterima melalui Bank BSI</li>
                    <li>Pastikan melakukan pendaftaran dengan nomor WhatsApp dan email yang aktif</li>
                    <li>Jika ada kendala, silahkan hubungi kami melalui nomor WhatsApp Panitia</li>
                  </ul>
                </motion.div>
              )}

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Column 1 */}
                <div>
                  {isTeam ? (
                    <>
                      <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                        <label htmlFor="registrantName" className="block text-gray-700 text-base font-bold mb-2">
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
                            className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
                          />
                          <User className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                        </div>
                      </motion.div>
                      <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                        <label htmlFor="teamName" className="block text-gray-700 text-base font-bold mb-2">
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
                            className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
                            />
                          <User className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                        <label htmlFor="name" className="block text-gray-700 text-base font-bold mb-2">
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
                            className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
                          />
                          <User className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                        </div>
                      </motion.div>
                      <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                        <label htmlFor="gender" className="block text-gray-700 text-base font-bold mb-2">
                          Jenis Kelamin
                        </label>
                        <div className="relative">
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender || ''}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300 appearance-none"
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
                        <label htmlFor="birthDate" className="block text-gray-700 text-base font-bold mb-2">
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
                            className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
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
                    <label htmlFor="whatsapp" className="block text-gray-700 text-base font-bold mb-2">
                      No. WhatsApp
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp || ''}
                        onChange={handleChange}
                        placeholder="+628xxxxxxxxxx"
                        required
                        className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
                      />
                      <Phone className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                    </div>
                  </motion.div>
    
                  <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                    <label htmlFor="email" className="block text-gray-700 text-base font-bold mb-2">
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
                        className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
                      />
                      <Mail className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                    </div>
                  </motion.div>
    
                  {selectedCategory !== 'UMUM' && (
                    <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                      <label htmlFor="school" className="block text-gray-700 text-base font-bold mb-2">
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
                          className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
                        />
                        <School className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                      </div>
                    </motion.div>
                  )}
                </div>
    
                {/* Column 3 */}
                <div>
                  <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                    <label htmlFor="city" className="block text-gray-700 text-base font-bold mb-2">
                      Kota/Kabupaten
                    </label>
                    <div className="relative">
                      <select
                        id="city"
                        name="city"
                        value={formData.city || ''}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300 appearance-none"
                      >
                        <option value="" disabled>
                          Pilih Kota/Kabupaten
                        </option>
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
                      <label htmlFor="ktsSuratAktif" className="block text-gray-700 text-base font-bold mb-2">
                        KTS / Surat Aktif (PDF)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="ktsSuratAktif"
                          name="ktsSuratAktif"
                          onChange={(e) => handleFileChange(e)}
                          accept=".pdf"
                          required
                          className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
                        />
                        <FileText className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                      </div>
                    </motion.div>
                  )}
    
                  <motion.div className="mb-4 md:mb-6" variants={itemVariants}>
                    <label htmlFor="buktiPembayaran" className="block text-gray-700 text-base font-bold mb-2">
                      Bukti Pembayaran (PDF)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="buktiPembayaran"
                        name="buktiPembayaran"
                        onChange={(e) => handleFileChange(e)}
                        accept=".pdf"
                        required
                        className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
                      />
                      <Upload className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                    </div>
                  </motion.div>
    
                  {selectedCompetition?.requirePassportPhoto && !isTeam && (
                    <motion.div className="col-span-1 md:col-span-3 space-y-4" variants={itemVariants}>
                      <div className="relative">
                        <label htmlFor="pasPhoto" className="block text-gray-700 text-base font-bold mb-2">
                          Pas Foto (JPG/PNG, max 500KB)
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            id="pasPhoto"
                            name="pasPhoto"
                            onChange={(e) => handleFileChange(e)}
                            accept="image/jpeg,image/png"
                            required
                            className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
                          />
                          <Upload className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
    
                {/* Team Members section (if applicable) */}
                {isTeam && (
                  <motion.div className="col-span-1 md:col-span-3 mt-4 md:mt-6" variants={itemVariants}>
                    <label className="block text-gray-700 text-base font-bold mb-2">
                      Anggota Tim (Maksimum {teamSize} anggota)
                    </label>
                    {teamMembers.map((member, index) => (
                      <div key={index} className="mb-4">
                        {selectedCompetition?.requirePassportPhoto ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="relative flex-grow">
                                  <input
                                    type="text"
                                    value={member}
                                    onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                                    className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
                                    placeholder={`Nama Anggota ${index + 1}`}
                                  />
                                  <User className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                                </div>
                                {index > 0 && (
                                  <motion.button
                                    type="button"
                                    onClick={() => removeTeamMember(index)}
                                    className="flex-shrink-0 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Hapus
                                  </motion.button>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="relative">
                                <input
                                  type="file"
                                  id={`pasPhoto-${index}`}
                                  name="pasPhoto"
                                  onChange={(e) => handleFileChange(e, index)}
                                  accept="image/jpeg,image/png"
                                  required
                                  className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
                                  placeholder="Upload Pas Foto"
                                />
                                <Upload className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                                <span className="text-sm text-gray-500 mt-1 block">
                                  Pas Foto {member || `Anggota ${index + 1}`} (JPG/PNG, max 500KB)
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="relative flex-grow">
                              <input
                                type="text"
                                value={member}
                                onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                                className="w-full pl-10 px-3 py-2 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-300"
                                placeholder={`Nama Anggota ${index + 1}`}
                              />
                              <User className="absolute left-3 top-2 md:top-3 text-gray-400" size={20} />
                            </div>
                            {index > 0 && (
                              <motion.button
                                type="button"
                                onClick={() => removeTeamMember(index)}
                                className="flex-shrink-0 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Hapus
                              </motion.button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Tombol Tambah Anggota */}
                    {teamMembers.length < teamSize && (
                      <motion.button
                        type="button"
                        onClick={addTeamMember}
                        className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition duration-300 mt-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex items-center gap-2">
                          <Plus size={20} />
                          <span>Tambah Anggota</span>
                        </div>
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
                      isSubmitting ? 'bg-emerald-400' : 'bg-emerald-800 hover:bg-emerald-700'
                    } text-white py-2 md:py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105`}
                    whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.80 }}
                  >
                    {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
                  </motion.button>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      </motion.form>
    </section>
  );
};

export default RegistrationForm;