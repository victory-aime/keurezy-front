import { Icons } from '_components/custom';
import { FaRegFilePdf } from 'react-icons/fa';

export const downloadFile = async (file: string) => {
  const response = await fetch(file);
  const blob = await response.blob();
  const url = new URL(file);
  const fileName = url.pathname.split('/').pop() || 'document.pdf';

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const getFileIcon = (url: string) => {
  const ext = url.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext ?? '')) return Icons.LuFileImage;
  if (['pdf', 'docx'].includes(ext ?? '')) return FaRegFilePdf;
  return Icons.LuFile;
};

export const getFileIconColor = (url: string) => {
  const ext = url.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext ?? ''))
    return {
      bg: 'green.50',
      color: 'green.600',
    };
  if (['pdf', 'docx'].includes(ext ?? ''))
    return {
      bg: 'blue.50',
      color: 'blue.600',
    };
  return {
    bg: 'gray.100',
    color: 'gray.600',
  };
};
