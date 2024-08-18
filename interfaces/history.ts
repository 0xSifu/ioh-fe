interface History {
    attachmentFile: string[];  // Array of URLs to attachment files
    body: string;  // Email body content
    category: string;  // Category of the email
    claimNumber: string;  // Claim number
    createdBy: string;  // Creator of the email
    createdDate: string;  // Date and time when the email was created
    diagnosaAwal: string;  // Initial diagnosis
    diagnosalain: string;  // Additional diagnosis
    dokter: string;  // Doctor's name
    efektifPolis: string;  // Effective policy number
    emailCc: string[];  // Array of CC email addresses
    emailTo: string[];  // Array of recipient email addresses
    id: string;  // Unique identifier for the email
    lokasi: string;  // Location (e.g., country)
    namaPasien: string;  // Patient's name
    namaRumahSakit: string;  // Hospital's name
    noPolis: string;  // Policy number
    plan: string;  // Plan code
    remark: string;  // Remarks or comments
    subCategory: string;  // Sub-category of the email
    subject: string;  // Email subject
    tanggalLahir: string;  // Date of birth
    tanggalPerawatan: string;  // Date of treatment
  }
  