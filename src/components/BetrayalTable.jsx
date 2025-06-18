import React from "react";
import data from "../data/betrayalData.json";

const BetrayalTable = () => {
  const { betrayal_rewards } = data;
  const divisions = ["Transportation", "Fortification", "Research", "Intervention"];

  // Цвета для градации
  const colorMap = {
    green: '#4CAF50',
    orange: '#FF9800',
    yellow: '#FFEB3B',
    red: '#F44336'
  };

  return (
    <div className="betrayal-table">
      <table>
        <thead>
          <tr>
            <th className="division-header"></th>
            {betrayal_rewards.map(member => (
              <th key={member.member} style={{ 
                backgroundColor: colorMap[member.color] || '#333',
                color: member.color === 'yellow' ? '#000' : '#fff'
              }}>
                {member.image && (
                  <img 
                    src={`${member.image}`} 
                    alt={member.member} 
                    className="member-icon"
                  />
                )}
                {member.member}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {divisions.map(division => (
            <tr key={division}>
              <td className="division-header">{division}</td>
              {betrayal_rewards.map(member => {
                const reward = member.divisions.find(d => d.name === division);
                return (
                  <td 
                    key={`${member.member}-${division}`}
                    className={
                      reward?.bold 
                        ? `bold-effect${member.color ? ` bold-effect-${member.color}` : ''}` 
                        : ''
                    }
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
  );
};

export default BetrayalTable;