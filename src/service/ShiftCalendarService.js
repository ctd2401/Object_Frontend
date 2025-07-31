export default {
  listShiftCalendars({ type = 0, date = new Date() }) {
    // type: 0 - lấy data theo tuần || 1 - lấy data theo tháng
    if (type == 0) {
      const week_key = Object.keys(data).find((key) => {
        const [start, end] = key.split('_to_');
        const isInWeek = isDateInRangePure(date, start, end);
        return isInWeek;
      });
      return new Promise((resolve, reject) => {
        if (!week_key) {
          reject('Không có dữ liệu');
        } else {
          resolve({
            success: true,
            data: data[week_key],
            week_key: week_key
          });
        }
      });
    } else {
      const week_key = Object.keys(data).find((key) => {
        const [start, end] = key.split('_to_');
        const isInWeek = isDateInRangePure(date, start, end);
        return isInWeek;
      });
      return new Promise((resolve, reject) => {
        resolve({
          success: true,
          data: data[week_key]
        });
        if (!week_key) reject('Không có dữ liệu');
      });
    }
  }
};

function isDateInRangePure(targetDateStr, startDateStr, endDateStr) {
  const targetDate = new Date(targetDateStr);
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // Reset giờ về 00:00:00 để so sánh chỉ theo ngày
  targetDate.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  return targetDate >= startDate && targetDate <= endDate;
}

const data = {
  '2025-06-30_to_2025-07-06': {
    S: {
      Monday: {
        id: 1,
        date: '2025-06-30',
        store: 1,
        shift_config: {
          code: 'S'
        }
      },
      Tuesday: {
        id: 2,
        date: '2025-07-01',
        store: 1,
        shift_config: {
          code: 'S'
        }
      }
    },
    C: {
      Monday: {
        id: 3,
        date: '2025-06-30',
        store: 1,
        shift_config: {
          code: 'C'
        }
      },
      Tuesday: {
        id: 4,
        date: '2025-07-01',
        store: 1,
        shift_config: {
          code: 'C'
        }
      }
    }
  },
  '2025-07-07_to_2025-07-13': {
    S: {
      Monday: {
        id: 5,
        date: '2025-07-07',
        store: 1,
        shift_config: {
          code: 'S'
        }
      },
      Tuesday: {
        id: 6,
        date: '2025-07-08',
        store: 1,
        shift_config: {
          code: 'S'
        }
      }
    },
    C: {
      Monday: {
        id: 7,
        date: '2025-07-07',
        store: 1,
        shift_config: {
          code: 'C'
        }
      },
      Tuesday: {
        id: 8,
        date: '2025-07-08',
        store: 1,
        shift_config: {
          code: 'C'
        }
      }
    }
  }
};
