import React, { useRef, useState, useEffect } from "react";
import data from "../data/betrayalData.json";
import SaveTableButton from "./SaveTableButton";

const BetrayalTable = () => {
  const tableRef = useRef(null);
  const { betrayal_rewards } = data;
  const divisions = ["Transportation", "Fortification", "Research", "Intervention"];

  const colorMap = {
    green: '#4CAF50',
    orange: '#FF9800',
    yellow: '#FFEB3B',
    red: '#F44336',
    transparent: 'transparent'
  };

  // Загрузка состояний из localStorage при инициализации
  const [cellColors, setCellColors] = useState(() => {
    const savedColors = localStorage.getItem('betrayalTableColors');
    return savedColors ? JSON.parse(savedColors) : {};
  });

  const availableColors = ['green', 'orange', 'yellow', 'red', 'transparent'];

  // Сохранение в localStorage при изменении состояний
  useEffect(() => {
    localStorage.setItem('betrayalTableColors', JSON.stringify(cellColors));
  }, [cellColors]);

  const handleCellClick = (cellType, member, division = null) => {
    const cellKey = cellType === 'header' 
      ? `header-${member.member}` 
      : `${member.member}-${division}`;
    
    const initialColor = cellType === 'header' ? member.color : member.divisions.find(d => d.name === division)?.color;
    const currentColor = cellColors[cellKey] ?? initialColor;
    
    const currentIndex = availableColors.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % availableColors.length;
    const nextColor = availableColors[nextIndex];

    setCellColors(prev => ({
      ...prev,
      [cellKey]: nextColor
    }));
  };

  // Функция сброса всех цветов
  const resetColors = () => {
    if (window.confirm("Вы уверены, что хотите сбросить все цвета?")) {
      setCellColors({});
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <SaveTableButton tableRef={tableRef} fileName="betrayal-table" />
        <button 
          onClick={resetColors}
          style={{
            padding: '10px 20px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Сбросить цвета
        </button>
      </div>

      <div className="betrayal-table" ref={tableRef}>
        <table>
          {/* Остальная часть таблицы без изменений */}
          <thead>
            <tr>
              <th className="division-header"></th>
              {betrayal_rewards.map(member => {
                const headerKey = `header-${member.member}`;
                const currentColor = cellColors[headerKey] ?? member.color;
                
                return (
                  <th 
                    key={member.member} 
                    style={{ 
                      backgroundColor: colorMap[currentColor] || '#333',
                      color: currentColor === 'yellow' ? '#000' : '#fff',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleCellClick('header', member)}
                  >
                    {member.image && (
                      <img src={`${member.image}`} alt={member.member} className="member-icon" />
                    )}
                    {member.member}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {divisions.map(division => (
              <tr key={division}>
                <td className="division-header">{division}</td>
                {betrayal_rewards.map(member => {
                  const reward = member.divisions.find(d => d.name === division);
                  const cellKey = `${member.member}-${division}`;
                  const currentColor = cellColors[cellKey] ?? reward?.color;
                  
                  return (
                    <td 
                      key={cellKey}
                      className={currentColor ? `bold-effect bold-effect-${currentColor}` : ''}
                      onClick={() => handleCellClick('cell', member, division)}
                      style={{
                        backgroundColor: currentColor ? colorMap[currentColor] : 'transparent',
                        color: currentColor === 'yellow' ? '#000' : '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      {reward?.effect || "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BetrayalTable;