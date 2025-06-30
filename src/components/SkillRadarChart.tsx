import { FC } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { SkillData } from '@/types/skill';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface SkillRadarChartProps {
  skills: SkillData[];
}

const SkillRadarChart: FC<SkillRadarChartProps> = ({ skills }) => {
  if (skills.length < 3) return null; // need at least 3 points for polygon

  const data = {
    labels: skills.map((s) => s.name),
    datasets: [
      {
        label: 'Skill Level',
        data: skills.map((s) => s.level),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)'
      }
    ]
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          color: '#6B7280'
        },
        grid: {
          color: '#E5E7EB'
        },
        angleLines: {
          color: '#E5E7EB'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    },
    responsive: true,
    maintainAspectRatio: false
  } as const;

  return (
    <div className="w-full h-80 md:h-96">
      <Radar data={data} options={options} />
    </div>
  );
};

export default SkillRadarChart;
