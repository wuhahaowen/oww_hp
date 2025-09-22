import React, { useState, useEffect } from 'react';
import { mdiClockOutline } from '@mdi/js';
import { useLanguage } from '../../i18n/LanguageContext';
import BaseCard from '../BaseCard';
import dayjs from 'dayjs';
import Lunar from 'lunar-javascript';
import './style.css';

function TimeCard({config}) {
  const { timeFormat, dateFormat, title, titleVisible } = config;
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [lunarDate, setLunarDate] = useState('');
  const [weekday, setWeekday] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = dayjs();
      setCurrentTime(now);
      const weekday = now.format('dddd');

      setWeekday(t(`weekday.${weekday}`));
      const lunar = Lunar.Lunar.fromDate(now.toDate());
      const yearZhi = lunar.getYearShengXiao(); // 获取生肖
      setLunarDate(`${lunar.getYearInGanZhi()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}(${yearZhi}年)`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [t]); // 添加 t 到依赖数组

  return (
    <BaseCard
      title={'中建希好斯' || t('cardTitles.time')}
      titleVisible={titleVisible}
      icon={mdiClockOutline}
    >
      <div className="time-content">
        <div className="time">
          {currentTime.format(timeFormat)}
        </div>
        <div className="date">
          {currentTime.format(dateFormat)}
          <span className="weekday">
            {weekday}
          </span>
        </div>
        {/*<div className="lunar-date">*/}
        {/*  {lunarDate}*/}
        {/*</div>*/}
      </div>
    </BaseCard>
  );
}

export default TimeCard; 