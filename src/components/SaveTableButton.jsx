import React from 'react';
import html2canvas from 'html2canvas';
import PropTypes from 'prop-types';

const SaveTableButton = ({ tableRef, fileName = 'betrayal-table' }) => {
  const handleDownload = async () => {
    try {
      // 1. Преобразуем все изображения в base64
      const images = tableRef.current.querySelectorAll('img');
      await Promise.all(Array.from(images).map(convertImgToBase64));

      // 2. Создаем canvas с увеличенным scale
      const canvas = await html2canvas(tableRef.current, {
        scale: 3,
        logging: true,
        useCORS: false,
        allowTaint: true,
        backgroundColor: '#222',
        onclone: (clonedDoc) => {
          // Заменяем src на base64 в клоне DOM
          clonedDoc.querySelectorAll('img').forEach(img => {
            img.setAttribute('crossOrigin', 'anonymous');
            if (img.dataset.base64) {
              img.src = img.dataset.base64;
            }
          });
        }
      });

      // 3. Сохраняем результат
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Save failed:', error);
      alert('Ошибка сохранения. Проверьте консоль для деталей.');
    }
  };

  const convertImgToBase64 = (img) => {
    return new Promise((resolve) => {
      if (img.complete && img.naturalHeight !== 0) {
        getBase64Image(img, resolve);
      } else {
        img.onload = () => getBase64Image(img, resolve);
        img.onerror = resolve; // Продолжаем даже если ошибка
      }
    });
  };

  const getBase64Image = (img, callback) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    img.dataset.base64 = canvas.toDataURL('image/png');
    callback();
  };

  return (
    <button 
      onClick={handleDownload}
      style={{ padding: '10px 20px', background: '#4CAF50', color: 'white' }}
    >
      Сохранить таблицу
    </button>
  );
};

export default SaveTableButton;