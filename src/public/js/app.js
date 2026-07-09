// ============================================================
//  IntelliGrade — i18n Translation Dictionary
// ============================================================
const TRANSLATIONS = {
  en: {
    // Brand
    brand_tagline: 'Smart Academic Performance Analyzer',
    header_subtitle: 'PDF exam marks are identified, GPA calculated & Excel reports generated automatically',
    // Steps
    step1_badge: 'Step 01',
    step1_title: 'Upload PDF Files',
    step2_badge: 'Step 02',
    step2_title: 'Enter Module Credits',
    step2_desc: 'Enter the credit value for each identified module:',
    step3_badge: 'Step 03',
    step3_title: 'GPA Progress Chart (Preview)',
    // Upload
    upload_drag_text: 'Drag & Drop one or more PDF files here',
    upload_or: 'or',
    upload_browse_btn: 'Browse from Computer',
    // Buttons
    btn_view_grading: 'View Grading Scale',
    btn_analyze_files: 'Analyze Selected PDFs',
    btn_calculate_gpa: 'Calculate GPA (Process)',
    btn_download_excel: 'Download Excel (.xlsx)',
    btn_reset_scale: 'Reset to Default Scale',
    btn_save_scale: 'Confirm Grading Scale',
    // Stats
    stat_total_students: 'Total Students',
    stat_passed_students: 'Passed Students (Pass)',
    stat_failed_students: 'Failed Students (Fail)',
    // Analytics
    gpa_distribution: 'GPA Distribution (GPA Ranges)',
    performance_levels: 'Special Performance Levels',
    gpa_above_30: 'GPA 3.0 or above',
    gpa_above_27: 'GPA 2.7 or above',
    // Table
    table_no: 'No.',
    table_reg_no: 'Registration Number',
    table_student_name: 'Student Name',
    table_gpa: 'GPA',
    table_empty_state: 'Results will appear here after processing data.',
    search_placeholder: 'Search by IT Number...',
    // Modal
    modal_grading_title: 'GPA Grading Scale Settings',
    modal_grading_intro: 'GPA values given by mark categories are shown below. You may change them if needed.',
    modal_col_grade: 'Grade',
    modal_col_gpa: 'GPA (Grade Point)',
    modal_col_min: 'Minimum Mark (%)',
    // Loader
    loader_default: 'Analyzing file, please wait...',
    loader_uploading: 'Analyzing PDF files. Please wait a moment...',
    loader_processing: 'Calculating and ranking GPA scores...',
    loader_excel: 'Preparing Excel report. Please wait a moment...',
    // Toast messages
    toast_err_title: 'Error',
    toast_err_scale: 'Could not load the default Grading Scale.',
    toast_err_invalid_file: 'is not a valid PDF file. Please select only PDF (.pdf) files.',
    toast_err_duplicate_file: 'is selected twice. Duplicate file removed.',
    toast_err_no_data: 'No data available for processing. Please upload a PDF again.',
    toast_err_invalid_scale: 'Check the values entered for the Grading Scale (GPA: 0 - 4.0, Mark: 0 - 100).',
    toast_err_download: 'Could not generate the Excel report.',
    toast_err_sample: 'Could not load the sample PDF. Run scripts/generateSample.js first.',
    toast_success_title: 'Success',
    toast_success_upload: 'PDF files analyzed successfully. {modules} module(s) and {students} student(s) identified and merged.',
    toast_success_process: 'GPA calculation and student ranking completed successfully.',
    toast_success_download: 'Excel report downloaded successfully.',
    toast_success_scale: 'Grading Scale updated. New grades saved successfully.',
    toast_warn_title: 'Warning',
    toast_warn_invalid_scale: 'Invalid Values',
    toast_warn_no_data: 'No Data',
    toast_warn_duplicate: 'Duplicate File',
    toast_info_scale_reset: 'Grading Scale reset to default values.',
    toast_err_analysis: 'Analysis Error',
    toast_err_process: 'Processing Error',
    // Module form
    module_label_shortname: 'Short Name:',
    module_label_credits: 'Credits:',
    module_sub_label: 'Exam Subject Module',
    // Table rendering
    table_no_results: 'No students found with the searched registration number.',
    // Grade column header suffix
    grade_header_suffix: 'Grade',
    // File info
    file_info_single: 'Selected file: ',
    file_info_multiple: 'Selected {n} file(s) ({size} MB)',
    file_info_selected_single: 'Selected file: {name} ({size} MB)',
  },

  si: {
    // Brand
    brand_tagline: 'බුද්ධිමත් ශාස්ත්‍රීය කාර්ය සාධන විශ්ලේෂකය',
    header_subtitle: 'PDF ගොනු හරහා විභාග ලකුණු හඳුනාගෙන, GPA ගණනය කර Excel වාර්තා ස්වයංක්‍රීයව සකසනු ලැබේ',
    // Steps
    step1_badge: 'පියවර 01',
    step1_title: 'PDF ගොනු Upload කරන්න',
    step2_badge: 'පියවර 02',
    step2_title: 'Module Credits ඇතුළත් කරන්න',
    step2_desc: 'හඳුනාගත් එක් එක් Module එක සඳහා හිමිවන Credit ප්‍රමාණය ලබාදෙන්න:',
    step3_badge: 'පියවර 03',
    step3_title: 'GPA ප්‍රගති සටහන (Preview)',
    // Upload
    upload_drag_text: 'PDF ගොනු (එකක් හෝ කිහිපයක්) මෙතැනට Drag & Drop කරන්න',
    upload_or: 'හෝ',
    upload_browse_btn: 'පරිගණකයෙන් තෝරන්න',
    // Buttons
    btn_view_grading: 'Grading Scale එක බලන්න',
    btn_analyze_files: 'තෝරාගත් PDF විශ්ලේෂණය කරන්න',
    btn_calculate_gpa: 'GPA ගණනය කරන්න (Process)',
    btn_download_excel: 'Excel Download කරන්න (.xlsx)',
    btn_reset_scale: 'Default Scale එකට සකසන්න',
    btn_save_scale: 'Grading Scale එක තහවුරු කරන්න',
    // Stats
    stat_total_students: 'මුළු සිසුන් ගණන',
    stat_passed_students: 'සමත් වූ සිසුන් (Pass)',
    stat_failed_students: 'අසමත් වූ සිසුන් (Fail)',
    // Analytics
    gpa_distribution: 'GPA ව්‍යාප්තිය (GPA Ranges)',
    performance_levels: 'විශේෂ කාර්ය සාධන මට්ටම්',
    gpa_above_30: 'GPA 3.0 හෝ ඊට වැඩි සිසුන්',
    gpa_above_27: 'GPA 2.7 හෝ ඊට වැඩි සිසුන්',
    // Table
    table_no: 'අනු අංකය',
    table_reg_no: 'ලියාපදිංචි අංකය',
    table_student_name: 'ශිෂ්‍යයාගේ නම',
    table_gpa: 'GPA',
    table_empty_state: 'දත්ත සකස් කිරීමෙන් පසු ප්‍රතිඵල ලේඛනය මෙහි දිස්වේ.',
    search_placeholder: 'IT Number එකෙන් සොයන්න...',
    // Modal
    modal_grading_title: 'GPA Grading Scale එක සැකසීම',
    modal_grading_intro: 'ලකුණු කාණ්ඩ අනුව ලබා දෙන GPA අගයන් (Grade Points) පහත දැක්වේ. අවශ්‍ය නම් වෙනස් කරන්න.',
    modal_col_grade: 'ශ්‍රේණිය',
    modal_col_gpa: 'GPA (Grade Point)',
    modal_col_min: 'අවම ලකුණු (%)',
    // Loader
    loader_default: 'ගොනුව විශ්ලේෂණය කරමින් පවතී...',
    loader_uploading: 'PDF ගොනු විශ්ලේෂණය කරමින් පවතී. කරුණාකර මදක් රැඳී සිටින්න...',
    loader_processing: 'GPA ගණනය කරමින් සහ ශ්‍රේණිගත කරමින් පවතී...',
    loader_excel: 'Excel වාර්තාව සකසමින් පවතී. කරුණාකර මදක් රැඳී සිටින්න...',
    // Toast messages
    toast_err_title: 'දෝෂයකි',
    toast_err_scale: 'Default Grading Scale එක ලබාගත නොහැකි විය.',
    toast_err_invalid_file: 'යනු වලංගු PDF ගොනුවක් නොවේ. PDF (.pdf) ගොනු පමණක් තෝරන්න.',
    toast_err_duplicate_file: 'දෙවරක් තෝරා ඇත. නකල් ගොනුව ඉවත් කෙරිණි.',
    toast_err_no_data: 'විශ්ලේෂණය සඳහා දත්ත නොමැත. කරුණාකර නැවත PDF එකක් upload කරන්න.',
    toast_err_invalid_scale: 'Grading Scale එකට ඇතුළත් කළ අගයන් නිවැරදි දැයි පරීක්ෂා කරන්න (GPA: 0 - 4.0, Mark: 0 - 100).',
    toast_err_download: 'Excel වාර්තාව සකස් කිරීම අසාර්ථක විය.',
    toast_err_sample: 'පරීක්ෂණ PDF ගොනුව ලබා ගැනීමට නොහැකි විය. scripts/generateSample.js ධාවනය කරන්න.',
    toast_success_title: 'සාර්ථකයි',
    toast_success_upload: 'PDF ගොනු සාර්ථකව විශ්ලේෂණය කෙරිණි. Module {modules} ක් සහ සිසුන් {students} ක් හඳුනාගෙන merge කරන ලදී.',
    toast_success_process: 'GPA ගණනය කිරීම සහ සිසුන් ශ්‍රේණිගත කිරීම සාර්ථකව සිදු කරන ලදී.',
    toast_success_download: 'Excel වාර්තාව සාර්ථකව භාගත (Download) කරන ලදී.',
    toast_success_scale: 'Grading Scale එක යාවත්කාලීන විය. නව ශ්‍රේණිගත කිරීම් සාර්ථකව සුරක්ෂිත කරන ලදී.',
    toast_warn_title: 'අවවාදයයි',
    toast_warn_invalid_scale: 'වලංගු නොවන අගයන්',
    toast_warn_no_data: 'දත්ත නොමැත',
    toast_warn_duplicate: 'නකල් ගොනුවකි',
    toast_info_scale_reset: 'Grading Scale එක default අගයන්ට සකසන ලදී.',
    toast_err_analysis: 'විශ්ලේෂණ දෝෂයකි',
    toast_err_process: 'දත්ත සැකසීමේ දෝෂයකි',
    // Module form
    module_label_shortname: 'කෙටි නම:',
    module_label_credits: 'Credits:',
    module_sub_label: 'විභාග විෂය Module',
    // Table rendering
    table_no_results: 'සොයන ලද ලියාපදිංචි අංකයෙන් සිසුන් කිසිවෙකු හමු නොවීය.',
    // Grade column header suffix
    grade_header_suffix: 'ශ්‍රේණිය',
    // File info
    file_info_single: 'තෝරාගත් ගොනුව: ',
    file_info_multiple: 'තෝරාගත් ගොනු {n} ක් ({size} MB)',
    file_info_selected_single: 'තෝරාගත් ගොනුව: {name} ({size} MB)',
  },

  ta: {
    // Brand
    brand_tagline: 'புத்திசாலி கல்வி செயல்திறன் பகுப்பாய்வி',
    header_subtitle: 'PDF மூலம் தேர்வு மதிப்பெண்கள் கண்டறியப்பட்டு, GPA கணக்கிடப்பட்டு, Excel அறிக்கைகள் தானாக உருவாக்கப்படும்',
    // Steps
    step1_badge: 'படி 01',
    step1_title: 'PDF கோப்புகளை பதிவேற்றவும்',
    step2_badge: 'படி 02',
    step2_title: 'Module Credits உள்ளிடவும்',
    step2_desc: 'கண்டறியப்பட்ட ஒவ்வொரு Module க்கும் Credit மதிப்பை உள்ளிடவும்:',
    step3_badge: 'படி 03',
    step3_title: 'GPA முன்னேற்ற அட்டவணை (Preview)',
    // Upload
    upload_drag_text: 'ஒன்று அல்லது அதிகமான PDF கோப்புகளை இங்கே Drag & Drop செய்யவும்',
    upload_or: 'அல்லது',
    upload_browse_btn: 'கணினியிலிருந்து தேர்ந்தெடுக்கவும்',
    // Buttons
    btn_view_grading: 'Grading Scale பார்க்கவும்',
    btn_analyze_files: 'தேர்ந்தெடுக்கப்பட்ட PDFகளை பகுப்பாய்வு செய்யவும்',
    btn_calculate_gpa: 'GPA கணக்கிடவும் (Process)',
    btn_download_excel: 'Excel பதிவிறக்கம் (.xlsx)',
    btn_reset_scale: 'Default Scale ஆக மீட்டமைக்கவும்',
    btn_save_scale: 'Grading Scale உறுதிப்படுத்தவும்',
    // Stats
    stat_total_students: 'மொத்த மாணவர்கள்',
    stat_passed_students: 'தேர்ச்சி பெற்ற மாணவர்கள்',
    stat_failed_students: 'தோல்வியுற்ற மாணவர்கள்',
    // Analytics
    gpa_distribution: 'GPA விநியோகம் (GPA வரம்புகள்)',
    performance_levels: 'சிறப்பு செயல்திறன் நிலைகள்',
    gpa_above_30: 'GPA 3.0 அல்லது அதற்கு மேல்',
    gpa_above_27: 'GPA 2.7 அல்லது அதற்கு மேல்',
    // Table
    table_no: 'வ.எண்',
    table_reg_no: 'பதிவு எண்',
    table_student_name: 'மாணவர் பெயர்',
    table_gpa: 'GPA',
    table_empty_state: 'தரவு செயலாக்கப்பட்ட பின் முடிவுகள் இங்கே தோன்றும்.',
    search_placeholder: 'IT எண்ணால் தேடவும்...',
    // Modal
    modal_grading_title: 'GPA Grading Scale அமைப்புகள்',
    modal_grading_intro: 'மதிப்பெண் வகைகளுக்கு வழங்கப்பட்ட GPA மதிப்புகள் கீழே காட்டப்பட்டுள்ளன. தேவைப்பட்டால் மாற்றலாம்.',
    modal_col_grade: 'தரம்',
    modal_col_gpa: 'GPA (Grade Point)',
    modal_col_min: 'குறைந்தபட்ச மதிப்பெண் (%)',
    // Loader
    loader_default: 'கோப்பு பகுப்பாய்வு செய்யப்படுகிறது, கொஞ்சம் காத்திருக்கவும்...',
    loader_uploading: 'PDF கோப்புகள் பகுப்பாய்வு செய்யப்படுகின்றன. சிறிது காத்திருக்கவும்...',
    loader_processing: 'GPA கணக்கிடப்பட்டு தரவரிசைப்படுத்தப்படுகிறது...',
    loader_excel: 'Excel அறிக்கை தயாரிக்கப்படுகிறது. சிறிது காத்திருக்கவும்...',
    // Toast messages
    toast_err_title: 'பிழை',
    toast_err_scale: 'Default Grading Scale ஐ பெற முடியவில்லை.',
    toast_err_invalid_file: 'என்பது சரியான PDF கோப்பு அல்ல. PDF (.pdf) கோப்புகளை மட்டும் தேர்ந்தெடுக்கவும்.',
    toast_err_duplicate_file: 'இரண்டு முறை தேர்ந்தெடுக்கப்பட்டுள்ளது. நகல் கோப்பு அகற்றப்பட்டது.',
    toast_err_no_data: 'செயலாக்கத்திற்கு தரவு இல்லை. மீண்டும் PDF பதிவேற்றவும்.',
    toast_err_invalid_scale: 'Grading Scale இல் உள்ளிட்ட மதிப்புகளை சரிபார்க்கவும் (GPA: 0 - 4.0, Mark: 0 - 100).',
    toast_err_download: 'Excel அறிக்கை உருவாக்கம் தோல்வியடைந்தது.',
    toast_err_sample: 'மாதிரி PDF கோப்பை பெற முடியவில்லை. scripts/generateSample.js இயக்கவும்.',
    toast_success_title: 'வெற்றி',
    toast_success_upload: 'PDF கோப்புகள் வெற்றிகரமாக பகுப்பாய்வு செய்யப்பட்டன. {modules} Module(கள்) மற்றும் {students} மாணவர்கள் கண்டறியப்பட்டு இணைக்கப்பட்டனர்.',
    toast_success_process: 'GPA கணக்கீடு மற்றும் மாணவர் தரவரிசை வெற்றிகரமாக நிறைவடைந்தது.',
    toast_success_download: 'Excel அறிக்கை வெற்றிகரமாக பதிவிறக்கப்பட்டது.',
    toast_success_scale: 'Grading Scale புதுப்பிக்கப்பட்டது. புதிய மதிப்பீடுகள் சேமிக்கப்பட்டன.',
    toast_warn_title: 'எச்சரிக்கை',
    toast_warn_invalid_scale: 'தவறான மதிப்புகள்',
    toast_warn_no_data: 'தரவு இல்லை',
    toast_warn_duplicate: 'நகல் கோப்பு',
    toast_info_scale_reset: 'Grading Scale இயல்புநிலை மதிப்புகளுக்கு மீட்டமைக்கப்பட்டது.',
    toast_err_analysis: 'பகுப்பாய்வு பிழை',
    toast_err_process: 'தரவு செயலாக்க பிழை',
    // Module form
    module_label_shortname: 'சுருக்கப் பெயர்:',
    module_label_credits: 'Credits:',
    module_sub_label: 'தேர்வு பாட Module',
    // Table rendering
    table_no_results: 'தேடிய பதிவு எண்ணில் மாணவர்கள் யாரும் கிடைக்கவில்லை.',
    // Grade column header suffix
    grade_header_suffix: 'தரம்',
    // File info
    file_info_single: 'தேர்ந்தெடுக்கப்பட்ட கோப்பு: ',
    file_info_multiple: 'தேர்ந்தெடுக்கப்பட்ட {n} கோப்புகள் ({size} MB)',
    file_info_selected_single: 'தேர்ந்தெடுக்கப்பட்ட கோப்பு: {name} ({size} MB)',
  }
};

// ============================================================
//  i18n Engine
// ============================================================
let currentLang = 'en';

function t(key, vars = {}) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];
  let str = dict[key] || TRANSLATIONS['en'][key] || key;
  // Replace template variables like {n}, {name}, {modules}, etc.
  Object.keys(vars).forEach(k => {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
  });
  return str;
}

function applyTranslations() {
  // Translate all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
  // Update page title
  document.title = 'IntelliGrade — ' + (currentLang === 'si' ? 'විභාග ලකුණු සකසනය' : currentLang === 'ta' ? 'தேர்வு மதிப்பெண் செயலி' : 'Exam Module Marks Processing & GPA Analyzer');
  // Re-render dynamic content if it exists
  if (parsedModules.length > 0) {
    renderCreditsForm();
  }
  if (processedResults) {
    renderResultsTable(processedResults.students, processedResults.modules, processedResults.shortNames);
  }
}

function setLanguage(lang) {
  currentLang = lang;
  // Update active button state
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  // Update button label
  const labels = { en: 'English', si: 'සිංහල', ta: 'தமிழ்' };
  document.getElementById('lang-current-label').textContent = labels[lang] || 'English';
  // Apply translations
  applyTranslations();
  // Close dropdown
  closeLangDropdown();
}

function closeLangDropdown() {
  const dropdown = document.getElementById('lang-dropdown');
  const chevron = document.getElementById('lang-chevron');
  dropdown.classList.remove('open');
  chevron.classList.remove('open');
}

function setupLanguageSelector() {
  const langBtn = document.getElementById('lang-btn');
  const langDropdown = document.getElementById('lang-dropdown');
  const langChevron = document.getElementById('lang-chevron');

  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = langDropdown.classList.contains('open');
    if (isOpen) {
      closeLangDropdown();
    } else {
      langDropdown.classList.add('open');
      langChevron.classList.add('open');
    }
  });

  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setLanguage(btn.dataset.lang);
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!document.getElementById('lang-selector-wrapper').contains(e.target)) {
      closeLangDropdown();
    }
  });
}

// ============================================================
//  App State
// ============================================================
let accumulatedFiles = [];
let parsedModules = [];
let parsedStudents = [];
let activeGradingScale = [];
let processedResults = null;

// DOM Elements
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');
const fileInfoText = document.getElementById('file-info-text');

const stepUpload = document.getElementById('step-upload');
const stepCredits = document.getElementById('step-credits');
const modulesList = document.getElementById('modules-list');
const creditsForm = document.getElementById('credits-form');

const resultsPanel = document.getElementById('results-panel');
const btnDownloadExcel = document.getElementById('btn-download-excel');
const statTotalStudents = document.getElementById('stat-total-students');
const statMaxGpa = document.getElementById('stat-max-gpa');
const searchInput = document.getElementById('search-input');
const tableHeaders = document.getElementById('table-headers');
const tableBody = document.getElementById('table-body');

const btnShowGrading = document.getElementById('btn-show-grading');
const gradingModal = document.getElementById('grading-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const scaleTableBody = document.getElementById('scale-table-body');
const btnSaveScale = document.getElementById('btn-save-scale');
const btnResetScale = document.getElementById('btn-reset-scale');

const loader = document.getElementById('loader');
const loaderText = document.getElementById('loader-text');



// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
  fetchGradingScale();
  setupDragAndDrop();
  setupEventListeners();
  setupLanguageSelector();
  applyTranslations(); // Apply English by default
});

// Toast System
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-circle-xmark';
  if (type === 'warning') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close"><i class="fa-solid fa-xmark"></i></button>
  `;

  container.appendChild(toast);

  // Close button functionality
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'fadeOut 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }
  }, 5000);
}

// Loader Controls
function showLoader(textKey) {
  loaderText.textContent = textKey || t('loader_default');
  loader.classList.add('active');
}

function hideLoader() {
  loader.classList.remove('active');
}

// APIs Call: Fetch default grading scale
async function fetchGradingScale() {
  try {
    const response = await fetch('/api/grading-scale');
    if (!response.ok) throw new Error('Grading scale fetch failed');
    activeGradingScale = await response.json();
    renderGradingScaleEditor();
  } catch (error) {
    showToast(t('toast_err_title'), t('toast_err_scale'), 'error');
  }
}

// Render Grading Scale Modal Content
function renderGradingScaleEditor() {
  scaleTableBody.innerHTML = '';
  // Sort descending by min mark
  const sortedScale = [...activeGradingScale].sort((a, b) => b.min - a.min);
  
  sortedScale.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.grade}</strong></td>
      <td>
        <input type="number" step="0.1" min="0" max="4.0" class="input-scale scale-gpa" 
               data-grade="${item.grade}" value="${item.gpa}">
      </td>
      <td>
        <input type="number" min="0" max="100" class="input-scale scale-min" 
               data-grade="${item.grade}" value="${item.min}">
      </td>
    `;
    scaleTableBody.appendChild(tr);
  });
}

// Drag & Drop configuration
function setupDragAndDrop() {
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  });

  browseBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handleFiles(fileInput.files);
    }
  });
}

// File selection checker (supports multiple files, appends incrementally)
function handleFiles(files) {
  const incomingFiles = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      showToast(t('toast_err_title'), `"${file.name}" ${t('toast_err_invalid_file')}`, 'error');
      return;
    }
    incomingFiles.push(file);
  }

  // Add files to accumulatedFiles if they don't already exist by name
  incomingFiles.forEach(file => {
    const exists = accumulatedFiles.some(f => f.name === file.name);
    if (!exists) {
      accumulatedFiles.push(file);
    } else {
      showToast(t('toast_warn_duplicate'), `"${file.name}" ${t('toast_err_duplicate_file')}`, 'warning');
    }
  });

  renderAccumulatedFiles();
}

function renderAccumulatedFiles() {
  const filesListContainer = document.getElementById('uploaded-files-list');
  const btnAnalyze = document.getElementById('btn-analyze-files');
  
  if (!filesListContainer) return;
  
  filesListContainer.innerHTML = '';
  
  if (accumulatedFiles.length > 0) {
    filesListContainer.style.display = 'flex';
    accumulatedFiles.forEach((f, idx) => {
      const item = document.createElement('div');
      item.className = 'uploaded-file-item';
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-file-pdf" style="color: #ef4444;"></i>
          <span>${f.name} <small style="opacity: 0.6;">(${(f.size / 1024 / 1024).toFixed(2)} MB)</small></span>
        </div>
        <button type="button" class="btn-remove-file" data-index="${idx}" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px; display: inline-flex; align-items: center; justify-content: center;">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;
      filesListContainer.appendChild(item);
    });
    
    // Add event listeners to delete buttons
    filesListContainer.querySelectorAll('.btn-remove-file').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-index'));
        accumulatedFiles.splice(idx, 1);
        renderAccumulatedFiles();
      });
    });

    // Update file info text
    let totalSize = accumulatedFiles.reduce((acc, f) => acc + f.size, 0);
    fileInfoText.style.display = 'flex';
    if (accumulatedFiles.length === 1) {
      fileInfoText.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${t('file_info_selected_single', { name: accumulatedFiles[0].name, size: (totalSize / 1024 / 1024).toFixed(2) })}`;
    } else {
      fileInfoText.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${t('file_info_multiple', { n: accumulatedFiles.length, size: (totalSize / 1024 / 1024).toFixed(2) })}`;
    }

    if (btnAnalyze) {
      btnAnalyze.style.display = 'inline-flex';
    }
  } else {
    filesListContainer.style.display = 'none';
    fileInfoText.style.display = 'none';
    if (btnAnalyze) {
      btnAnalyze.style.display = 'none';
    }
  }
}

// Extract text from a single PDF file using pdf.js (client-side)
// Reconstructs the lines by grouping Y-coordinates, and dynamically clusters X-coordinates
// of student row elements to output structured pipe-separated (|) text columns.
async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // Configure pdf.js worker
  if (typeof pdfjsLib === 'undefined') {
    throw new Error('PDF.js library not loaded. Please refresh the page.');
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdfDoc = await loadingTask.promise;
  
  let fullText = '';
  
  // Regex to detect common index numbers to locate student rows
  const BROAD_REG_NO_REGEX = /\b(?:IT|SE|IE|BM|EN|EG)\d{7,8}\b|\b(?:IT|SE|IE|BM|EN|EG)\s*\d{2}\s*\d{4}\s*\d{2}\b|\b[A-Z0-9]{2,4}(?:[/-][A-Z0-9]{1,4}){2,4}\b|\b[A-Z]{1,2}[/-]\d{2,4}[/-]\d{3,4}\b|\b\d{6}[A-Z]\b|\b[A-Z]{1,3}\d{5,8}\b|\b\d{5,8}[A-Z]{1,3}\b|\b\d{7,9}\b/i;

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Group text items by Y-position with a threshold (robust line reconstruction)
    const linesMap = {};
    const threshold = 5; // points
    
    textContent.items.forEach(item => {
      if (!item.str || item.str.trim() === '') return;
      
      const x = item.transform[4];
      const y = item.transform[5];
      
      let foundKey = null;
      for (const k of Object.keys(linesMap)) {
        if (Math.abs(parseFloat(k) - y) < threshold) {
          foundKey = k;
          break;
        }
      }
      
      if (foundKey === null) {
        foundKey = y.toString();
        linesMap[foundKey] = [];
      }
      
      linesMap[foundKey].push({ str: item.str, x });
    });
    
    // Sort lines top to bottom (Y descending)
    const sortedYKeys = Object.keys(linesMap).sort((a, b) => parseFloat(b) - parseFloat(a));
    
    // Gather X coordinates of text items that belong to student rows to build column layout
    const xCoords = [];
    
    sortedYKeys.forEach(y => {
      const lineItems = linesMap[y];
      lineItems.sort((a, b) => a.x - b.x);
      const lineText = lineItems.map(item => item.str).join(' ');
      
      // Determine if it looks like a student row (has ID regex, or name-like words + numeric marks)
      const hasMarks = lineItems.some(item => !isNaN(parseFloat(item.str)) && parseFloat(item.str) >= 0 && parseFloat(item.str) <= 100);
      const hasNameWords = lineItems.filter(item => /^[a-zA-Z]{3,}$/.test(item.str.trim())).length >= 2;
      const isStudentRow = BROAD_REG_NO_REGEX.test(lineText) || (hasMarks && hasNameWords);
      
      if (isStudentRow) {
        lineItems.forEach(item => {
          xCoords.push(item.x);
        });
      }
    });
    
    // Cluster X coordinates to find column boundaries
    let columns = [];
    if (xCoords.length > 0) {
      xCoords.sort((a, b) => a - b);
      let currentCluster = [xCoords[0]];
      const clusterTolerance = 15; // points
      
      for (let i = 1; i < xCoords.length; i++) {
        const x = xCoords[i];
        const lastX = currentCluster[currentCluster.length - 1];
        
        if (x - lastX < clusterTolerance) {
          currentCluster.push(x);
        } else {
          const avg = currentCluster.reduce((sum, v) => sum + v, 0) / currentCluster.length;
          columns.push(avg);
          currentCluster = [x];
        }
      }
      if (currentCluster.length > 0) {
        const avg = currentCluster.reduce((sum, v) => sum + v, 0) / currentCluster.length;
        columns.push(avg);
      }
    }
    
    columns.sort((a, b) => a - b);
    
    // Reconstruct lines into pipe-separated structured CSV
    if (columns.length > 1) {
      sortedYKeys.forEach(y => {
        const lineItems = linesMap[y];
        const rowCells = Array.from({ length: columns.length }, () => []);
        
        lineItems.forEach(item => {
          let closestColIdx = 0;
          let minDistance = Math.abs(item.x - columns[0]);
          
          for (let c = 1; c < columns.length; c++) {
            const dist = Math.abs(item.x - columns[c]);
            if (dist < minDistance) {
              minDistance = dist;
              closestColIdx = c;
            }
          }
          rowCells[closestColIdx].push(item);
        });
        
        const delimitedLine = rowCells.map(cellItems => {
          cellItems.sort((a, b) => a.x - b.x);
          return cellItems.map(item => item.str).join(' ').trim();
        }).join(' | ');
        
        fullText += delimitedLine + '\n';
      });
    } else {
      // Fallback to basic string reconstruction
      sortedYKeys.forEach(y => {
        const lineItems = linesMap[y];
        lineItems.sort((a, b) => a.x - b.x);
        fullText += lineItems.map(item => item.str).join(' ') + '\n';
      });
    }
  }
  
  return fullText;
}

// Upload multiple PDFs — extract text client-side, send text to server
async function uploadFiles(files) {
  showLoader(t('loader_uploading'));

  try {
    const allModulesSet = new Set();
    const combinedStudentsMap = {};
    let totalProcessed = 0;

    for (const file of files) {
      // Extract text client-side using pdf.js
      let extractedText;
      try {
        extractedText = await extractTextFromPdf(file);
      } catch (extractErr) {
        console.error(`Failed to extract text from ${file.name}:`, extractErr);
        throw new Error(`PDF text extraction failed for "${file.name}". Please ensure it is a valid, non-scanned PDF file.`);
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error(`"${file.name}" PDF file is empty or contains no readable text. Please use a text-based (non-scanned/image) PDF.`);
      }

      // Send extracted text to server for parsing
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText, filename: file.name })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to parse "${file.name}"`);
      }

      // Merge results
      data.modules.forEach(mod => allModulesSet.add(mod));
      data.students.forEach(student => {
        const regNum = student.registrationNumber.toUpperCase();
        if (!combinedStudentsMap[regNum]) {
          combinedStudentsMap[regNum] = {
            registrationNumber: regNum,
            studentName: student.studentName || null,
            marks: {},
            grades: {}
          };
        }
        if (student.studentName && !combinedStudentsMap[regNum].studentName) {
          combinedStudentsMap[regNum].studentName = student.studentName;
        }
        Object.assign(combinedStudentsMap[regNum].marks, student.marks || {});
        if (student.grades) {
          Object.assign(combinedStudentsMap[regNum].grades, student.grades);
        }
      });
      totalProcessed++;
    }

    // Reset and store new parsed data
    parsedModules = Array.from(allModulesSet);
    parsedStudents = Object.values(combinedStudentsMap);

    // Ensure all students have all modules
    parsedModules.forEach(mod => {
      parsedStudents.forEach(student => {
        if (student.marks[mod] === undefined) student.marks[mod] = 0;
        if (!student.grades[mod]) student.grades[mod] = 'E';
      });
    });

    processedResults = null;

    showToast(t('toast_success_title'), t('toast_success_upload', { modules: parsedModules.length, students: parsedStudents.length }), 'success');
    
    // Transition UI to Step 2
    renderCreditsForm();
    stepCredits.classList.add('active');
    
    // Smooth scroll to credits
    stepCredits.scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    showToast(t('toast_err_analysis'), error.message, 'error');
    console.error(error);
  } finally {
    hideLoader();
  }
}

// Render dynamic credit input form with short names
function renderCreditsForm() {
  modulesList.innerHTML = '';
  parsedModules.forEach(mod => {
    const row = document.createElement('div');
    row.className = 'module-input-row';
    row.innerHTML = `
      <div class="module-info">
        <span class="module-code">${mod}</span>
        <span class="module-name">${t('module_sub_label')}</span>
      </div>
      <div class="module-inputs-group">
        <div class="input-field">
          <label for="shortname-${mod}">${t('module_label_shortname')}</label>
          <input type="text" id="shortname-${mod}" name="shortname-${mod}" class="input-shortname" 
                 placeholder="e.g. OOP" value="${mod.substring(0, 6).toUpperCase()}" required>
        </div>
        <div class="input-field">
          <label for="credit-${mod}">${t('module_label_credits')}</label>
          <input type="number" id="credit-${mod}" name="${mod}" class="input-credit" 
                 min="1" max="10" step="0.5" value="3.0" required>
        </div>
      </div>
    `;
    modulesList.appendChild(row);
  });
}

// Submit credits and calculate GPA
async function handleProcessSubmit(e) {
  e.preventDefault();
  
  if (parsedModules.length === 0 || parsedStudents.length === 0) {
    showToast(t('toast_warn_no_data'), t('toast_err_no_data'), 'warning');
    return;
  }

  showLoader(t('loader_processing'));

  // Extract credit values and short names
  const credits = {};
  const shortNames = {};
  parsedModules.forEach(mod => {
    const inputCredit = document.getElementById(`credit-${mod}`);
    const inputShortname = document.getElementById(`shortname-${mod}`);
    credits[mod] = parseFloat(inputCredit.value);
    shortNames[mod] = inputShortname.value.trim().toUpperCase() || mod;
  });

  try {
    const response = await fetch('/api/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        students: parsedStudents,
        modules: parsedModules,
        credits: credits,
        gradingScale: activeGradingScale
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || t('loader_processing'));
    }

    processedResults = data;
    processedResults.shortNames = shortNames;
    renderResultsTable(data.students, data.modules, shortNames);
    
    // Enable results UI
    resultsPanel.classList.remove('disabled');
    btnDownloadExcel.disabled = false;
    
    // Populate stats
    statTotalStudents.textContent = data.students.length;
    updateDashboardStats(data.students);

    showToast(t('toast_success_title'), t('toast_success_process'), 'success');
    
    // Scroll to results panel
    resultsPanel.scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    showToast(t('toast_err_process'), error.message, 'error');
    console.error(error);
  } finally {
    hideLoader();
  }
}

// Computes and updates pass/fail ratios, GPA ranges, and cumulative thresholds
function updateDashboardStats(students) {
  const total = students.length;
  
  // 1. Pass vs Fail count: Fail is C- or lower (inclusive of C-), Pass is C or higher for all subjects
  const failGrades = ['C-', 'D+', 'D', 'E', 'F'];
  let passedCount = 0;
  let failedCount = 0;
  
  students.forEach(student => {
    let failed = false;
    if (student.grades) {
      failed = Object.values(student.grades).some(g => {
        const gradeName = (g.grade || '').toUpperCase().trim();
        const gradeGp = parseFloat(g.gpa || g.gpa === 0 ? g.gpa : 2.0);
        // Fail if grade is in fail list or grade point is less than C (2.0)
        return failGrades.includes(gradeName) || gradeGp < 2.0;
      });
    }
    if (failed) {
      failedCount++;
    } else {
      passedCount++;
    }
  });

  // Update DOM for pass/fail
  const statPassed = document.getElementById('stat-passed-students');
  const statFailed = document.getElementById('stat-failed-students');
  if (statPassed) statPassed.textContent = total > 0 ? `${passedCount} (${((passedCount / total) * 100).toFixed(1)}%)` : '-';
  if (statFailed) statFailed.textContent = total > 0 ? `${failedCount} (${((failedCount / total) * 100).toFixed(1)}%)` : '-';

  // 2. GPA ranges
  let count35_40 = 0;
  let count30_35 = 0;
  let count25_30 = 0;
  let count20_25 = 0;
  
  // GPA thresholds: inclusive (>= 3.0 and >= 2.7)
  let countAbove30 = 0;
  let countAbove27 = 0;

  students.forEach(student => {
    const gpa = student.gpa;
    if (gpa >= 3.5 && gpa <= 4.0) count35_40++;
    else if (gpa >= 3.0 && gpa < 3.5) count30_35++;
    else if (gpa >= 2.5 && gpa < 3.0) count25_30++;
    else if (gpa >= 2.0 && gpa < 2.5) count20_25++;

    if (gpa >= 3.0) countAbove30++;
    if (gpa >= 2.7) countAbove27++;
  });

  // Update GPA counts
  const el35_40 = document.getElementById('count-gpa-35-40');
  const el30_35 = document.getElementById('count-gpa-30-35');
  const el25_30 = document.getElementById('count-gpa-25-30');
  const el20_25 = document.getElementById('count-gpa-20-25');

  if (el35_40) el35_40.textContent = count35_40;
  if (el30_35) el30_35.textContent = count30_35;
  if (el25_30) el25_30.textContent = count25_30;
  if (el20_25) el20_25.textContent = count20_25;

  // Update progress bars
  const bar35_40 = document.getElementById('bar-gpa-35-40');
  const bar30_35 = document.getElementById('bar-gpa-30-35');
  const bar25_30 = document.getElementById('bar-gpa-25-30');
  const bar20_25 = document.getElementById('bar-gpa-20-25');

  if (bar35_40) bar35_40.style.width = total > 0 ? `${(count35_40 / total) * 100}%` : '0%';
  if (bar30_35) bar30_35.style.width = total > 0 ? `${(count30_35 / total) * 100}%` : '0%';
  if (bar25_30) bar25_30.style.width = total > 0 ? `${(count25_30 / total) * 100}%` : '0%';
  if (bar20_25) bar20_25.style.width = total > 0 ? `${(count20_25 / total) * 100}%` : '0%';

  // Update thresholds counts
  const elAbove30 = document.getElementById('count-gpa-above-30');
  const elAbove27 = document.getElementById('count-gpa-above-27');

  if (elAbove30) elAbove30.textContent = countAbove30;
  if (elAbove27) elAbove27.textContent = countAbove27;
}

// Render GPA sorted preview table with grades and subject short names
function renderResultsTable(students, modules, shortNames = {}) {
  const hasNames = students.some(s => s.studentName);

  // Populate headers with short names
  tableHeaders.innerHTML = `
    <th>${t('table_no')}</th>
    <th>${t('table_reg_no')}</th>
    ${hasNames ? `<th>${t('table_student_name')}</th>` : ''}
    ${modules.map(mod => `<th class="center-col">${shortNames[mod] || mod} ${t('grade_header_suffix')}</th>`).join('')}
    <th class="center-col">${t('table_gpa')}</th>
  `;

  // Map each student to their original 1-based rank (index in the main sorted list)
  const studentsWithRank = students.map((student, idx) => ({
    student,
    rank: idx + 1
  }));

  // Filter students based on current search query (matches both Registration Number and Student Name)
  const query = searchInput.value.toUpperCase().trim();
  const filteredStudents = studentsWithRank.filter(item => {
    const regMatch = item.student.registrationNumber.includes(query);
    const nameMatch = item.student.studentName && item.student.studentName.toUpperCase().includes(query);
    return regMatch || nameMatch;
  });

  if (filteredStudents.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="${(hasNames ? 4 : 3) + modules.length}" class="empty-state">
          <i class="fa-solid fa-magnifying-glass-minus empty-icon"></i>
          <p>${t('table_no_results')}</p>
        </td>
      </tr>
    `;
    return;
  }

  // Populate data rows
  tableBody.innerHTML = '';
  filteredStudents.forEach(({ student, rank }) => {
    const tr = document.createElement('tr');
    
    // Color coding for GPA
    let gpaClass = 'gpa-low';
    if (student.gpa >= 3.7) {
      gpaClass = 'gpa-high';
    } else if (student.gpa >= 2.0) {
      gpaClass = 'gpa-medium';
    }

    const marksCells = modules.map(mod => {
      const gradeInfo = student.grades[mod];
      if (!gradeInfo) return '<td class="center-col">-</td>';
      
      let gradeClass = 'grade-e';
      const grade = gradeInfo.grade;
      if (grade.startsWith('A')) gradeClass = 'grade-a';
      else if (grade.startsWith('B')) gradeClass = 'grade-b';
      else if (grade.startsWith('C')) gradeClass = 'grade-c';
      else if (grade.startsWith('D')) gradeClass = 'grade-d';

      return `
        <td class="center-col">
          <span class="grade-tag ${gradeClass}">
            ${grade}
          </span>
        </td>
      `;
    }).join('');

    tr.innerHTML = `
      <td class="center-col">${rank}</td>
      <td><strong>${student.registrationNumber}</strong></td>
      ${hasNames ? `<td>${student.studentName || '-'}</td>` : ''}
      ${marksCells}
      <td class="center-col">
        <span class="gpa-badge ${gpaClass}">${student.gpa.toFixed(2)}</span>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Download formatted Excel workbook
async function downloadExcelReport() {
  if (!processedResults) {
    showToast(t('toast_err_title'), t('toast_err_download'), 'warning');
    return;
  }

  showLoader(t('loader_excel'));

  try {
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        students: processedResults.students,
        modules: processedResults.modules,
        shortNames: processedResults.shortNames
      })
    });

    if (!response.ok) {
      throw new Error(t('toast_err_download'));
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GPA_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    showToast(t('toast_success_title'), t('toast_success_download'), 'success');

  } catch (error) {
    showToast(t('toast_err_title'), t('toast_err_download'), 'error');
    console.error(error);
  } finally {
    hideLoader();
  }
}

// Sample file loaders (Tabular and Block)
async function loadSamplePdf(type) {
  showLoader(t('loader_uploading'));
  try {
    const response = await fetch(`/api/sample/${type}`);
    if (!response.ok) throw new Error('Sample fetch failed');
    
    const blob = await response.blob();
    const file = new File([blob], `sample_${type}.pdf`, { type: 'application/pdf' });
    
    handleFiles([file]);
  } catch (error) {
    showToast(t('toast_err_title'), t('toast_err_sample'), 'error');
  } finally {
    hideLoader();
  }
}

// Modal controls and Event listeners setup
function setupEventListeners() {
  // Analyze selected files
  const btnAnalyze = document.getElementById('btn-analyze-files');
  if (btnAnalyze) {
    btnAnalyze.addEventListener('click', () => {
      if (accumulatedFiles.length > 0) {
        uploadFiles(accumulatedFiles);
      }
    });
  }

  // Process credits form
  creditsForm.addEventListener('submit', handleProcessSubmit);

  // Search input filter
  searchInput.addEventListener('input', () => {
    if (processedResults) {
      renderResultsTable(processedResults.students, processedResults.modules, processedResults.shortNames);
    }
  });

  // Download excel report
  btnDownloadExcel.addEventListener('click', downloadExcelReport);



  // Modal open-close
  btnShowGrading.addEventListener('click', () => {
    gradingModal.classList.add('active');
  });

  btnCloseModal.addEventListener('click', () => {
    gradingModal.classList.remove('active');
  });

  gradingModal.addEventListener('click', (e) => {
    if (e.target === gradingModal) {
      gradingModal.classList.remove('active');
    }
  });

  // Save customized grading scale
  btnSaveScale.addEventListener('click', () => {
    const scaleGpaInputs = document.querySelectorAll('.scale-gpa');
    const scaleMinInputs = document.querySelectorAll('.scale-min');
    
    const newScale = [];
    let isValid = true;

    scaleGpaInputs.forEach((input, index) => {
      const grade = input.getAttribute('data-grade');
      const gpa = parseFloat(input.value);
      const min = parseFloat(scaleMinInputs[index].value);

      if (isNaN(gpa) || gpa < 0 || gpa > 4.0 || isNaN(min) || min < 0 || min > 100) {
        isValid = false;
        return;
      }

      newScale.push({ grade, gpa, min });
    });

    if (!isValid) {
      showToast(t('toast_warn_invalid_scale'), t('toast_err_invalid_scale'), 'error');
      return;
    }

    activeGradingScale = newScale;
    showToast(t('toast_success_title'), t('toast_success_scale'), 'success');
    gradingModal.classList.remove('active');
  });

  // Reset scale to default
  btnResetScale.addEventListener('click', () => {
    fetchGradingScale().then(() => {
      showToast(t('toast_success_title'), t('toast_info_scale_reset'), 'info');
    });
  });
}
