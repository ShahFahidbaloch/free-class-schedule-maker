const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../src/components/AcademicStudioApp.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// Define the plan menu dropdown JSX so it can be rendered consistently
const planDropdownInner = `
                    <button
                      onClick={() => {
                        const cur = plans.find(p => p.id === activePlanId);
                        setNewPlanName(cur?.name || 'Plan A');
                        setIsPlanMenuOpen(false);
                        setIsRenamePlanModalOpen(true);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Rename Current Plan</span>
                    </button>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Duplicate Schedule To
                    </div>
                    {plans.filter(p => p.id !== activePlanId).map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleDuplicateCurrentPlan(p.id)}
                        className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                      >
                        <Copy className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Copy into {p.name}</span>
                      </button>
                    ))}

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                    <button
                      onClick={() => {
                        setIsPlanMenuOpen(false);
                        setIsPresetModalOpen(true);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Load Degree Preset...</span>
                    </button>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                    <button
                      onClick={handleTriggerStartEmpty}
                      className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Start Empty Schedule</span>
                    </button>

                    <button
                      onClick={handleTriggerReset}
                      className="w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Reset Sample Schedule</span>
                    </button>`;

const newHeader = `{/* Top Control Bar (M1: Responsive 2-Row Layout at ≤1100px, 1-Row at ≥1100px - Zero Overlaps) */}
        <header className="relative z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#121215]/95 backdrop-blur-md select-none shrink-0" ref={planMenuRef}>
          
          {/* 1. MOBILE (< 768px): Clean 2-Row Stacked Control Bar */}
          <div className="md:hidden flex flex-col">
            {/* Mobile Row 1: Brand & Primary Actions */}
            <div className="h-12 px-3 flex items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/60">
              <div className="flex items-center gap-2 min-w-0">
                <a 
                  href="/"
                  className="flex items-center p-0.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition shrink-0"
                  title="Return to Home"
                >
                  <img src="/logo.svg" alt="Class Schedule Logo" className="w-6 h-6 rounded-lg object-contain" />
                </a>
                <h1 className="text-sm font-bold tracking-tight text-zinc-950 dark:text-white truncate">
                  {t.nav?.scheduleStudio || 'Class Schedule'}
                </h1>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleOpenNewClassModal(mobileDay)}
                  className="h-8 px-2.5 rounded-xl bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold flex items-center gap-1 shadow-2xs transition active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Class</span>
                </button>

                <button
                  onClick={handleShareSchedule}
                  className="h-8 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                  title="Share Timetable Link"
                >
                  <Share2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => setIsStudioMenuOpen(true)}
                  className="h-8 w-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer shrink-0"
                  aria-label="Open Studio Menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Row 2: Plan A / B / C Pills + Quick Stats Snippet */}
            <div className="h-10 px-3 flex items-center justify-between gap-2 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-850 p-0.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 relative shrink-0">
                {plans.map(p => {
                  const isActive = p.id === activePlanId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSwitchPlan(p.id)}
                      className={\`px-2 py-0.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap \${
                        isActive
                          ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs font-bold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }\`}
                      title={\`Switch to \${p.name}\`}
                    >
                      {p.name}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setIsPlanMenuOpen(!isPlanMenuOpen)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition cursor-pointer ml-0.5"
                  title="Plan Options"
                >
                  <Sliders className="w-3 h-3" />
                </button>

                {isPlanMenuOpen && (
                  <div className="absolute left-0 mt-2 top-full w-48 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-xl py-1 z-50 text-xs">
                    ${planDropdownInner}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 shrink-0">
                <span><strong className="font-semibold text-zinc-950 dark:text-white">{metrics.totalCredits}</strong> cr</span>
                <span>&bull;</span>
                <span><strong className="font-semibold text-zinc-950 dark:text-white">{metrics.gapHours}h</strong> gaps</span>
              </div>
            </div>
          </div>

          {/* 2. TABLET & SMALL LAPTOP (768px to 1100px): Clean 2-Row Layout */}
          <div className="hidden md:flex xl:hidden flex-col">
            {/* Tablet Row 1: Title + Status Badges on Left; Utilities on Right */}
            <div className="h-12 px-4 sm:px-6 flex items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-3">
                <h1 className="text-sm font-bold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2 whitespace-nowrap">
                  <span>{t.nav?.scheduleStudio || 'Class Schedule Studio'}</span>
                </h1>
                
                {/* Status Badges */}
                <div className="flex items-center gap-2 text-xs font-medium px-2.5 py-0.5 rounded-full border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/60 whitespace-nowrap">
                  <span className="text-zinc-700 dark:text-zinc-300">
                    <strong className="font-semibold text-zinc-950 dark:text-white">{metrics.totalCredits}</strong> credits
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="text-zinc-700 dark:text-zinc-300">
                    <strong className="font-semibold text-zinc-950 dark:text-white">{metrics.gapHours}h</strong> gaps
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  {metrics.conflicts > 0 ? (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{metrics.conflicts} conflict{metrics.conflicts > 1 ? 's' : ''}</span>
                    </span>
                  ) : (
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                      <span>Conflict-free</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Tablet Row 1 Right: Utilities (Language, Undo, Reset, Guide) */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="relative" ref={langMenuRef}>
                  <button
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="h-8 px-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    title="Select Language"
                  >
                    <Globe className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-[10px] font-mono uppercase">{locale}</span>
                  </button>
                  {isLangMenuOpen && (
                    <div className="absolute right-0 mt-1.5 w-48 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                      {Object.values(LOCALES).map((loc) => (
                        <button
                          key={loc.code}
                          onClick={() => {
                            changeLocale(loc.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={\`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer \${
                            locale === loc.code
                              ? 'bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-950 dark:text-white'
                              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:text-zinc-950 dark:hover:text-white'
                          }\`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="text-sm">{loc.flag}</span>
                            <span className="font-medium">{loc.nativeName}</span>
                          </span>
                          {locale === loc.code && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className={\`h-8 w-8 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition shrink-0 \${
                    canUndo
                      ? 'text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer'
                      : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed opacity-40'
                  }\`}
                  title="Undo last action (Ctrl+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleTriggerReset}
                  className="h-8 w-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer shrink-0"
                  title="Reset sample schedule"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="h-8 w-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer shrink-0"
                  title="How to Use & Feature Instructions"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tablet Row 2: Plan Switcher on Left; Action Buttons on Right */}
            <div className="h-11 px-4 sm:px-6 flex items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/30">
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-850 p-0.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 relative shrink-0">
                {plans.map(p => {
                  const isActive = p.id === activePlanId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSwitchPlan(p.id)}
                      className={\`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap \${
                        isActive
                          ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs font-bold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }\`}
                      title={\`Switch to \${p.name}\`}
                    >
                      {p.name}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setIsPlanMenuOpen(!isPlanMenuOpen)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition cursor-pointer ml-0.5"
                  title="Plan Options"
                >
                  <Sliders className="w-3 h-3" />
                </button>

                {isPlanMenuOpen && (
                  <div className="absolute left-0 mt-2 top-full w-48 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-xl py-1 z-50 text-xs">
                    ${planDropdownInner}
                  </div>
                )}
              </div>

              {/* Tablet Row 2 Right: Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleOpenNewClassModal(mobileDay)}
                  className="h-8 px-3 rounded-xl bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Class</span>
                </button>
                <button
                  onClick={handleShareSchedule}
                  className="h-8 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1 transition cursor-pointer whitespace-nowrap"
                  title="Share Timetable Link"
                >
                  <Share2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => setIsPresetModalOpen(true)}
                  className="h-8 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1 transition cursor-pointer whitespace-nowrap"
                  title="Load Degree Presets"
                >
                  <Bookmark className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>Presets</span>
                </button>
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="h-8 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1 transition cursor-pointer whitespace-nowrap"
                  title="Export Timetable"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>Export</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="h-8 w-8 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer shrink-0"
                  title="Print / Save PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. LARGE DESKTOP (≥ 1100px / xl): Sleek Unified 1-Row Control Bar */}
          <div className="hidden xl:flex h-14 px-6 items-center justify-between gap-4 select-none">
            {/* Desktop Left: Title & Plan Switcher & Status Badges */}
            <div className="flex items-center gap-3.5 min-w-0">
              <h1 className="text-base font-bold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2 whitespace-nowrap shrink-0">
                <span>{t.nav?.scheduleStudio || 'Class Schedule Studio'}</span>
              </h1>

              {/* Plan Switcher */}
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-850 p-0.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 relative shrink-0">
                {plans.map(p => {
                  const isActive = p.id === activePlanId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSwitchPlan(p.id)}
                      className={\`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap \${
                        isActive
                          ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-2xs font-bold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }\`}
                      title={\`Switch to \${p.name}\`}
                    >
                      {p.name}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setIsPlanMenuOpen(!isPlanMenuOpen)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition cursor-pointer ml-0.5"
                  title="Plan Options"
                >
                  <Sliders className="w-3 h-3" />
                </button>

                {isPlanMenuOpen && (
                  <div className="absolute left-0 mt-2 top-full w-48 rounded-xl bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 shadow-xl py-1 z-50 text-xs">
                    ${planDropdownInner}
                  </div>
                )}
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/60 whitespace-nowrap shrink-0">
                <span className="text-zinc-700 dark:text-zinc-300">
                  <strong className="font-semibold text-zinc-950 dark:text-white">{metrics.totalCredits}</strong> credits
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="text-zinc-700 dark:text-zinc-300">
                  <strong className="font-semibold text-zinc-950 dark:text-white">{metrics.gapHours}h</strong> gaps
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                {metrics.conflicts > 0 ? (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{metrics.conflicts} conflict{metrics.conflicts > 1 ? 's' : ''}</span>
                  </span>
                ) : (
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                    <span>Conflict-free</span>
                  </span>
                )}
              </div>
            </div>

            {/* Desktop Right: All Primary & Secondary Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenNewClassModal(mobileDay)}
                className="h-9 px-3.5 rounded-xl bg-zinc-950 hover:bg-black text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{t.actions.newClass || 'Add Class'}</span>
              </button>

              <button
                onClick={handleShareSchedule}
                className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                title="Share Timetable Link"
              >
                <Share2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Share</span>
              </button>

              <button
                onClick={() => setIsPresetModalOpen(true)}
                className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                title="Load Degree Presets"
              >
                <Bookmark className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Presets</span>
              </button>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                title="Export Timetable"
              >
                <Download className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Export</span>
              </button>

              <button
                onClick={handlePrint}
                className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer shrink-0"
                title="Print / Save PDF"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer shrink-0"
                title="How to Use & Feature Instructions"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="h-9 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap shrink-0"
                title="Send Student Feedback & Rating"
              >
                <MessageSquare className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                <span>Feedback</span>
              </button>

              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="h-9 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                  title="Select Language"
                >
                  <Globe className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-[11px] font-mono uppercase">{locale}</span>
                </button>
                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                    {Object.values(LOCALES).map((loc) => (
                      <button
                        key={loc.code}
                        onClick={() => {
                          changeLocale(loc.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={\`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer \${
                          locale === loc.code
                            ? 'bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-950 dark:text-white'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:text-zinc-950 dark:hover:text-white'
                        }\`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-sm">{loc.flag}</span>
                          <span className="font-medium">{loc.nativeName}</span>
                        </span>
                        {locale === loc.code && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className={\`h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition shrink-0 \${
                  canUndo
                    ? 'text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer'
                    : 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed opacity-40'
                }\`}
                title="Undo last action (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleTriggerReset}
                className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition cursor-pointer shrink-0"
                title="Reset sample schedule"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </header>`;

const oldHeaderRegex = /\{\/\* Top Control Bar \*\/\}[\s\S]*?<\/header>/;
if (oldHeaderRegex.test(content)) {
  content = content.replace(oldHeaderRegex, newHeader);
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log('Successfully replaced old header with responsive 2-row layout.');
} else {
  console.error('Could not find old header pattern.');
}
