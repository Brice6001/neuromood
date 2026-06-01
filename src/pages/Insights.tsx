import React from 'react';

const Insights: React.FC = () => {
  const insights = [
    {
      title: "Sleep-Mood Connection",
      description: "You report 15% higher positivity scores on days after logging 7.5+ hours of sleep. Try to prioritize winding down by 10:30 PM.",
      icon: "nights_stay",
      color: "bg-primary-fixed text-on-primary-fixed-variant",
      tag: "Sleep Insight"
    },
    {
      title: "Mid-Afternoon Slumps",
      description: "A consistent decrease in focus and energy occurs around 3:00 PM. We recommend stepping away from your screen for a 5-minute stretch or walk.",
      icon: "wb_sunny",
      color: "bg-secondary-fixed text-on-secondary-fixed-variant",
      tag: "Energy Trend"
    },
    {
      title: "Mindfulness Impact",
      description: "Taking just 3 minutes to log a reflection corresponds to a sustained 20% reduction in logged stress levels for the next 4 hours.",
      icon: "self_improvement",
      color: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
      tag: "Wellness Habit"
    }
  ];

  return (
    <main className="pt-20 md:pt-8 pb-28 md:pb-8 px-container-padding-mobile md:px-container-padding-desktop md:ml-64 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-stack-md gap-4">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-text-primary">AI Wellness Insights</h2>
          <p className="text-text-secondary mt-1">Personalized, data-driven reflections powered by your mood logs.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
        {insights.map((insight, idx) => (
          <div key={idx} className="bg-surface rounded-DEFAULT shadow-[0_4px_6px_rgba(39,33,60,0.1)] p-6 flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-200">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 ${insight.color} rounded-full font-label-sm text-label-sm font-medium`}>
                  {insight.tag}
                </span>
                <span className="material-symbols-outlined text-text-muted">auto_awesome</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-[28px] text-primary">{insight.icon}</span>
                <h3 className="font-headline-md text-[20px] text-text-primary font-semibold">{insight.title}</h3>
              </div>
              <p className="text-text-secondary text-body-base leading-relaxed">
                {insight.description}
              </p>
            </div>
            <button className="mt-6 self-start px-4 py-2 border border-border-subtle hover:bg-surface-container-low text-primary rounded-full font-medium text-sm transition-colors">
              Explore Analytics
            </button>
          </div>
        ))}

        {/* Big Highlight AI Advice */}
        <div className="bg-secondary-fixed rounded-DEFAULT p-8 flex flex-col justify-between relative overflow-hidden md:col-span-2 lg:col-span-3">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <span className="material-symbols-outlined text-[120px]">psychology</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 text-secondary">
              <span className="material-symbols-outlined">auto_awesome</span>
              <h3 className="font-headline-md text-headline-md font-semibold">Weekly Neuro-Summary</h3>
            </div>
            <p className="text-on-secondary-fixed-variant text-[18px] md:text-[20px] leading-relaxed max-w-4xl mb-6">
              "Your overall mood balance has shifted towards **Serene** this week, representing a 12% improvement in emotional stability compared to last week. The biggest positive driver was regular evening journaling and consistent sleep patterns."
            </p>
          </div>
          <div className="flex gap-4 relative z-10 mt-4">
            <button className="px-6 py-3 bg-primary-container text-on-primary-container rounded-full font-medium shadow-sm hover:brightness-95 active:scale-[0.98] transition-all">
              Download Wellness PDF
            </button>
            <button className="px-6 py-3 bg-surface text-primary rounded-full font-medium shadow-sm hover:bg-surface-container-low active:scale-[0.98] transition-all">
              Share Report
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Insights;
