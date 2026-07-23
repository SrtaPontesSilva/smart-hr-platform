// frontend/src/shared/types/react-icons.d.ts
import * as React from 'react';

export interface IconBaseProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
  title?: string;
}

declare module 'react-icons/fa' {
  export const FaFilePdf: React.FC<IconBaseProps>;
  export const FaFileWord: React.FC<IconBaseProps>;
  export const FaPlus: React.FC<IconBaseProps>;
  export const FaUserCircle: React.FC<IconBaseProps>;
  export const FaEdit: React.FC<IconBaseProps>;
  export const FaTimes: React.FC<IconBaseProps>;
  export const FaArrowLeft: React.FC<IconBaseProps>;
  export const FaArrowRight: React.FC<IconBaseProps>;
  export const FaDownload: React.FC<IconBaseProps>;
  export const FaUsers: React.FC<IconBaseProps>;
  export const FaBell: React.FC<IconBaseProps>;
  export const FaSun: React.FC<IconBaseProps>;
  export const FaMoon: React.FC<IconBaseProps>;
  export const FaBars: React.FC<IconBaseProps>;
  export const FaUserTie: React.FC<IconBaseProps>;
  export const FaBuilding: React.FC<IconBaseProps>;
  export const FaHome: React.FC<IconBaseProps>;
  export const FaFilter: React.FC<IconBaseProps>;
  export const FaFileAlt: React.FC<IconBaseProps>;
  export const FaHandshake: React.FC<IconBaseProps>;
  export const FaFileSignature: React.FC<IconBaseProps>;
  export const FaChartBar: React.FC<IconBaseProps>;
  export const FaSignOutAlt: React.FC<IconBaseProps>;
  export const FaGraduationCap: React.FC<IconBaseProps>;
  export const FaBriefcase: React.FC<IconBaseProps>;
  export const FaTools: React.FC<IconBaseProps>;
  export const FaFolderOpen: React.FC<IconBaseProps>;
  export const FaIdCard: React.FC<IconBaseProps>;
  export const FaUser: React.FC<IconBaseProps>;
  export const FaChild: React.FC<IconBaseProps>;
  export const FaPhoneAlt: React.FC<IconBaseProps>;
  export const FaVoteYea: React.FC<IconBaseProps>;
  export const FaFileContract: React.FC<IconBaseProps>;
  export const FaMoneyCheckAlt: React.FC<IconBaseProps>;
  export const FaPaperPlane: React.FC<IconBaseProps>;
  export const FaRedo: React.FC<IconBaseProps>;
  export const FaMoneyBillWave: React.FC<IconBaseProps>;
  export const FaCheck: React.FC<IconBaseProps>;
  export const FaCheckCircle: React.FC<IconBaseProps>;
  export const FaCloudDownloadAlt: React.FC<IconBaseProps>;
  export const FaCaretDown: React.FC<IconBaseProps>;
  export const FaFileExcel: React.FC<IconBaseProps>;
  export const FaSearch: React.FC<IconBaseProps>;
}
