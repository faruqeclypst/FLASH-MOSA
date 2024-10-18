// src/utils/exportToExcel.ts
import ExcelJS from 'exceljs';
import { Registration, Competition } from '../types/index';
import { format, parse, isWithinInterval } from 'date-fns';

export const exportToExcel = async (registrations: Record<string, Registration>, competitions: Competition[] | undefined) => {
  if (!registrations || !competitions) {
    console.error("Registrations or competitions data is missing");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const allRegistrations = Object.entries(registrations);

  // Buat Home sheet
  const homeSheet = workbook.addWorksheet('Home');
  homeSheet.addRow(['FLASH Event Registrations']);
  homeSheet.addRow([]);
  homeSheet.addRow(['Kategori', 'Jumlah Pendaftar', 'Lihat Detail']);

  // Hitung jumlah pendaftar untuk setiap kategori
  const categoryCounts: Record<string, number> = {};
  competitions.forEach((competition) => {
    ['SD-MI', 'SMP-MTs', 'SMA-SMK-MA', 'UMUM'].forEach((category) => {
      const count = allRegistrations.filter(([_, reg]) => 
        reg && reg.competition === competition.name && 
        (reg.schoolCategory === category.replace('-', '/') || 
         (category === 'SMA-SMK-MA' && reg.schoolCategory === 'SMA/SMK/MA'))
      ).length;
      if (count > 0) {
        const key = `${competition.name} - ${category}`;
        categoryCounts[key] = (categoryCounts[key] || 0) + count;
      }
    });
  });

  // Tambahkan jumlah kategori dan link ke home data
  Object.entries(categoryCounts).forEach(([category, count], index) => {
    const row = homeSheet.addRow([category, count, `Lihat Detail`]);
    const linkCell = row.getCell(3);
    linkCell.value = {
      text: 'Lihat Detail',
      hyperlink: `#'${category}'!A1`,
      tooltip: `Klik untuk melihat detail ${category}`
    };
    linkCell.font = {
      color: { argb: '0000FF' },
      underline: true
    };
  });

  // Atur lebar kolom untuk home sheet
  homeSheet.getColumn(1).width = 40;
  homeSheet.getColumn(2).width = 20;
  homeSheet.getColumn(3).width = 15;

  // Buat sheet untuk setiap kompetisi dan kategori
  competitions.forEach((competition) => {
    ['SD-MI', 'SMP-MTs', 'SMA-SMK-MA', 'UMUM'].forEach((category) => {
      const sheetName = `${competition.name} - ${category}`;
      const filteredRegistrations = allRegistrations.filter(([_, reg]) => 
        reg && reg.competition === competition.name && 
        (reg.schoolCategory === category.replace('-', '/') || 
         (category === 'SMA-SMK-MA' && reg.schoolCategory === 'SMA/SMK/MA'))
      );

      if (filteredRegistrations.length > 0) {
        const worksheet = workbook.addWorksheet(sheetName);

        // Buat headers
        const headers = [
          'No.', 'Kode Pendaftaran', 'Tanggal Pendaftaran', 'Nama/Tim', 'Anggota Tim', 
          'WhatsApp', 'Kategori', 'Sekolah', 'Kompetisi', 'Kota', 'Email', 'Status', 
          'Jenis Kelamin', 'Tanggal Lahir', 'KTS/Surat Aktif', 'Bukti Pembayaran'
        ];
        worksheet.addRow(headers);

        // Buat data rows
        filteredRegistrations.forEach(([_, reg], index) => {
          worksheet.addRow([
            index + 1,
            reg.registrationCode || 'N/A',
            reg.registrationDate ? format(new Date(reg.registrationDate), 'dd/MM/yyyy HH:mm') : 'N/A',
            reg.teamName || reg.name || reg.registrantName || 'N/A',
            reg.teamMembers ? reg.teamMembers.join(', ') : 'N/A',
            reg.whatsapp || 'N/A',
            reg.schoolCategory || 'N/A',
            reg.school || 'N/A',
            reg.competition || 'N/A',
            reg.city || 'N/A',
            reg.email || 'N/A',
            reg.status || 'N/A',
            reg.gender || 'N/A',
            reg.birthDate || 'N/A',
            reg.ktsSuratAktif ? 'Ada' : 'Tidak Ada',
            reg.buktiPembayaran ? 'Ada' : 'Tidak Ada'
          ]);
        });

        // Atur freeze pane
        worksheet.views = [
          { state: 'frozen', xSplit: 4, ySplit: 1, topLeftCell: 'E2', activeCell: 'A1' }
        ];

        // Atur lebar kolom
        const minColumnWidth = 12; // Lebar minimum untuk setiap kolom
        worksheet.columns.forEach((column: Partial<ExcelJS.Column>, index: number) => {
          let maxLength = 0;
          if (column.eachCell) {
            column.eachCell({ includeEmpty: true }, (cell: ExcelJS.Cell) => {
              const cellLength = cell.value ? cell.value.toString().length : 0;
              maxLength = Math.max(maxLength, cellLength);
            });
            
            // Sesuaikan lebar kolom berdasarkan konten, dengan minimum dan maksimum
            if (column.width !== undefined) {
              column.width = Math.max(
                minColumnWidth,
                Math.min(maxLength + 2, 50) // Maksimum lebar 50
              );
            }
          }
        });

        // Atur lebar spesifik untuk beberapa kolom
        const columnWidths = [
          { header: 'No.', width: 5 },
          { header: 'Kode Pendaftaran', width: 18 },
          { header: 'Tanggal Pendaftaran', width: 18},
          { header: 'Nama/Tim', width: 20 },
          { header: 'Anggota Tim', width: 30 },
          { header: 'WhatsApp', width: 15 },
          { header: 'Kategori', width: 15 },
          { header: 'Sekolah', width: 30 },
          { header: 'Kompetisi', width: 20 },
          { header: 'Kota', width: 20 },
          { header: 'Email', width: 30 },
          { header: 'Status', width: 12 },
          { header: 'Jenis Kelamin', width: 15 },
          { header: 'Tanggal Lahir', width: 15 },
          { header: 'KTS/Surat Aktif', width: 20 },
          { header: 'Bukti Pembayaran', width: 20 }
        ];

        columnWidths.forEach((col, index) => {
          const column = worksheet.getColumn(index + 1);
          column.width = Math.max(col.width, column.width || 0);
          column.header = col.header;
        });

        // Terapkan warna pada sel status
        worksheet.getColumn(12).eachCell((cell: ExcelJS.Cell, rowNumber: number) => {
          if (rowNumber > 1) {
            if (cell.value === 'approved') {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '00FF00' }
              };
            } else if (cell.value === 'rejected') {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF0000' }
              };
            } else {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' }
              };
            }
          }
        });

        // Tambahkan hyperlink untuk KTS/Surat Aktif dan Bukti Pembayaran
        worksheet.getColumn(15).eachCell((cell: ExcelJS.Cell, rowNumber: number) => {
          if (rowNumber > 1 && cell.value === 'Ada') {
            const ktsSuratAktif = filteredRegistrations[rowNumber - 2][1].ktsSuratAktif;
            if (ktsSuratAktif) {
              cell.value = {
                text: 'Lihat Dokumen',
                hyperlink: ktsSuratAktif,
                tooltip: 'Klik untuk melihat dokumen'
              };
              cell.font = {
                color: { argb: '0000FF' },
                underline: true
              };
            }
          }
        });

        worksheet.getColumn(16).eachCell((cell: ExcelJS.Cell, rowNumber: number) => {
          if (rowNumber > 1 && cell.value === 'Ada') {
            const buktiPembayaran = filteredRegistrations[rowNumber - 2][1].buktiPembayaran;
            if (buktiPembayaran) {
              cell.value = {
                text: 'Lihat Dokumen',
                hyperlink: buktiPembayaran,
                tooltip: 'Klik untuk melihat dokumen'
              };
              cell.font = {
                color: { argb: '0000FF' },
                underline: true
              };
            }
          }
        });
      }
    });
  });

  // Tulis file Excel
  const buffer = await workbook.xlsx.writeBuffer({
    filename: 'FLASH_MOSA_Event_Registrations.xlsx',
    useStyles: true,
    useSharedStrings: true
  });
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'FLASH_MOSA_Event_Registrations.xlsx';
  link.click();
};