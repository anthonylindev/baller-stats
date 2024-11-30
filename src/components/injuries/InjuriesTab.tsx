import React, { useState, useEffect } from 'react'
import { Injury } from '@/types'
import { useInjuriesByTeam } from '@/hooks/useInjuriesByTeam'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { scrollToSection } from '@/lib/utils'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

const COLORS = ['#4ECDC4', '#FF6B6B'];
const BAR_COLORS = [
  '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399'
];


export const InjuriesTab: React.FC = () => {

  const { data, isLoading, error } = useInjuriesByTeam()

  if (isLoading) return <div>Loading...</div>
  if (error || !data) return <div>Error</div>

  const InjuriesBarChart = () => {
    const graphData = data.map(team => ({
      name: team.team.name.split(' ').pop() || team.team.name,
      injuries: team.injuries.length
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart onClick={(data) => scrollToSection(`#${data.activeLabel}`)} data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="name"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12, stroke: 'white', strokeWidth: 0.6 }}
          />
          <YAxis tick={{ stroke: '#ffff', strokeWidth: 0.6 }} />
          <Tooltip contentStyle={{ color: 'black' }} />
          <Bar dataKey="injuries" fill="#8884d8" className='cursor-pointer'>
            {graphData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">NBA Injuries by Team</h2>
      <Card className="p-4 hidden md:block bg-card">
        <CardHeader>
          <CardTitle className="text-xl text-primary">Injuries Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <InjuriesBarChart />
        </CardContent>
      </Card>
      {data.map((team) => (
        <Card id={team.team.name} key={team.team.name} className="overflow-hidden transition-shadow duration-200 hover:shadow-lg">
          <CardHeader className="bg-accent text-2xl">
            <CardTitle className='text-2xl text-primary'>{team.team.full_name}</CardTitle>
          </CardHeader>
          <CardContent className="text-left p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="flex-grow lg:pr-4 lg:max-w-[80%]">
                <InjuryList injuries={team.injuries} />
              </div>
              <div className="mt-6 lg:mt-0 flex flex-col items-center w-full lg:w-auto lg:min-w-[30%]">
                <div className="w-32 h-32 lg:w-40 lg:h-40">
                  <TeamHealthChart healthScore={Math.floor(((15 - team.injuries.length) / 15) * 100)} />
                </div>
                <p className="text-lg font-medium mt-2 text-primary">Team Health: {Math.floor(((15 - team.injuries.length) / 15) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const TeamHealthChart = ({ healthScore }: { healthScore: number }) => {
  const data = [
    { name: 'Healthy', value: healthScore },
    { name: 'Injured', value: 100 - healthScore },
  ];

  const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });
  const [animationActive, setAnimationActive] = useState(false);

  useEffect(() => {
    if (isIntersecting) {
      setAnimationActive(true);
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={25}
            outerRadius={40}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            isAnimationActive={animationActive}
            animationBegin={0}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

const InjuryList = ({ injuries }: { injuries: Injury[] }) => (
  <ul className="space-y-4">
    {injuries.map((injury, index) => (
      <li key={index} className="bg-accent p-3 rounded-md">
        <div className="font-semibold text-lg text-primary">{`${injury.player.first_name} ${injury.player.last_name}`}</div>
        <div className="text-sm text-muted-foreground mt-1">{injury.description}</div>
        <div className="text-sm font-medium text-accent-foreground mt-1">
          Expected return: <span className="text-primary">{injury.return_date}</span>
        </div>
      </li>
    ))}
  </ul>
)
