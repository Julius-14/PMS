'use client';

import axios from '@/app/lib/axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function SalesOverview ({ className }) {

  const [monthOptions, setMonthOptions] = useState([])
  const [monthCost, setMonthCost] = useState([])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Overview',
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: monthOptions,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Cost',
        data: monthCost,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
};

  const handleMonthArray = yr => {
    var monthArray = new Array(12).fill(0)
    yr.forEach(element=>{
      monthArray[new Date(element.created_at).getMonth()] += element.total
    })
    setMonthOptions(monthArray)
  }

  const handleMonthCost = yr => {
    var monthArray = new Array(12).fill(0)
    yr.forEach(element=>{
      monthArray[new Date(element.created_at).getMonth()] += element.total_cost
    })
    setMonthCost(monthArray)
  }

  useEffect(()=>{
    const getData = async () => {
      try {
        await axios.get('/api/sale/dashboard')
        .then(res=>{
          handleMonthArray(res.data.data)
          handleMonthCost(res.data.cost)
        })
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])

    return (
        <div className={className}>
            <Bar options={options} data={data} />
        </div>
    )
}