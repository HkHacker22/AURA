\# AURA Design System

Version: 1.0



> \*\*Design Philosophy\*\*

>

> AURA should feel like an AI operating system, not a productivity app.

>

> Calm. Intelligent. Premium. Minimal.

>

> Every interaction should reinforce that the AI is always present without overwhelming the user.



\---



\# Design Principles



\## 1. AI First



Everything revolves around the assistant.



The interface should never compete with the AI.



The AI should feel alive through subtle animations, gradients and motion.



\---



\## 2. Minimal Interface



Avoid:



\- heavy borders

\- unnecessary cards

\- dense layouts

\- colorful buttons everywhere



Prefer



\- whitespace

\- glass

\- blur

\- gradients

\- typography hierarchy



\---



\## 3. Premium Dark Theme



Primary experience is dark mode.



Background should never be flat black.



Instead use layered gradients with subtle animated lighting.



Inspired by:



\- Apple VisionOS

\- Linear

\- Arc Browser

\- Raycast

\- Aceternity UI

\- Vercel



\---



\# Color Palette



\## Primary



Purple



```

\#7C3AED

```



Indigo



```

\#6366F1

```



Blue



```

\#3B82F6

```



Cyan



```

\#06B6D4

```



Pink Accent



```

\#EC4899

```



\---



\## Background



Primary



```

\#09090B

```



Surface



```

\#111827

```



Elevated Surface



```

\#1A1F2E

```



Border



```

rgba(255,255,255,.08)

```



\---



\## Functional



Success



```

\#22C55E

```



Warning



```

\#F59E0B

```



Danger



```

\#EF4444

```



Information



```

\#3B82F6

```



\---



\# Typography



Font Family



\- Inter

\- Plus Jakarta Sans

\- Geist



Weights



```

700

600

500

400

```



Scale



Hero



```

48px

```



H1



```

40px

```



H2



```

32px

```



H3



```

24px

```



Body



```

16px

```



Small



```

14px

```



Caption



```

12px

```



\---



\# Layout



Spacing follows an \*\*8px system\*\*



```

4

8

12

16

24

32

40

48

64

80

```



Maximum Content Width



Desktop



```

1440px

```



Laptop



```

1280px

```



Tablet



```

768px

```



Mobile



```

390px

```



\---



\# Visual Language



\## Glassmorphism



Every important container should use



```

backdrop-blur-xl



rgba(255,255,255,.04)



border rgba(255,255,255,.08)



large radius



soft shadow

```



Never use heavy borders.



\---



\## Shadows



Prefer glow over shadow.



Example



```

0 0 80px rgba(124,58,237,.18)

```



\---



\## Radius



Buttons



```

16px

```



Cards



```

24px

```



Modals



```

28px

```



Inputs



```

18px

```



Floating Dock



```

999px

```



\---



\# Animations



All animations should be subtle.



Duration



```

150ms

250ms

400ms

```



Use



\- opacity

\- blur

\- scale

\- translateY



Avoid



\- bounce

\- elastic

\- spinning



\---



\# Inspiration Components



\## Home Background



Use



https://ui.aceternity.com/components/background-gradient-animation



Purpose



Animated gradient that slowly moves behind dashboard content.



\---



\## Profile



Use



https://ui.aceternity.com/components/background-lines



Purpose



Animated glowing background lines behind profile header.



\---



\## Bottom Navigation



Use



https://ui.aceternity.com/components/floating-dock



Requirements



\- floating

\- translucent

\- rounded

\- centered

\- icons only

\- active icon glows



\---



\## Save Me



Use



https://ui.aceternity.com/components/google-gemini-effect



Purpose



Large animated orb that reacts to hover and processing state.



Idle



Soft breathing glow.



Thinking



Rotating particles.



Complete



Pulse animation.



\---



\# Icons



Use



Lucide Icons



Style



\- 2px stroke

\- rounded

\- monochrome



\---



\# Components



\## Buttons



Variants



\- Primary

\- Secondary

\- Ghost

\- Danger

\- Gradient



Primary uses purple gradient.



Ghost has no background until hover.



\---



\## Cards



Every card should contain



\- title

\- description

\- optional icon

\- optional glow



Hover



```

translateY(-2px)



increase blur



increase glow

```



\---



\## Inputs



Rounded



Glass background



Purple focus ring



Placeholder opacity 50%



\---



\## Progress



Circular progress



Gradient progress bars



Animated numbers



\---



\# Dashboard



Contains



\## Greeting



```

Good Morning

```



Dynamic.



Uses actual time.



\---



\## AI Status



Top glass card



Shows



\- online

\- thinking

\- idle



\---



\## Agent Grid



Planner



Research



Reflection



Focus



Persona



Each card



\- icon

\- description

\- live status



\---



\## Today's Plan



Timeline



Modern cards



Color coded



\---



\## Weekly Progress



Charts



Smooth animations



Gradient area charts



\---



\# Brain Dump



Full screen immersive page.



Large animated microphone.



Conversation style.



Features



\- voice input

\- waveform

\- transcription

\- AI parsing

\- extracted tasks preview



\---



\# Schedule



Calendar



Timeline



Drag and drop



AI suggestions



Meeting cards



Energy blocks



\---



\# Tasks



Kanban style.



Priority colors.



Animated completion.



Natural language task creation.



\---



\# Save Me



Emergency mode.



Centerpiece is the Gemini Orb.



Below



\- workload score

\- burnout prediction

\- survival checklist

\- AI recommendations



When activated



Entire background slowly changes color.



\---



\# Profile



Hero section with



Background Lines animation.



Profile picture



Stats



Subscription



Preferences



Security



Connected Accounts



\---



\# Notifications



Timeline style.



Grouped by



\- AI

\- Tasks

\- Calendar

\- System



\---



\# Settings



Sections



\- Appearance

\- AI Preferences

\- Notifications

\- Integrations

\- Privacy

\- Billing



\---



\# Mobile



Navigation



Floating Dock.



Large touch targets.



Bottom sheet modals.



Single column.



\---



\# Tablet



Two column layout.



Floating dock remains.



\---



\# Desktop



Sidebar optional.



Dashboard uses responsive grid.



Maximum width 1440px.



\---



\# Accessibility



WCAG AA



Visible focus



Keyboard navigation



Reduced motion support



Contrast ≥ 4.5



\---



\# Performance



Animations



GPU accelerated.



Lazy load charts.



Lazy load AI widgets.



Avoid layout shifts.



\---



\# Overall Experience



The user should feel like they are interacting with



\- an AI operating system

\- a futuristic personal assistant

\- a premium Apple-quality product

\- an application designed around intelligence rather than forms



The experience should communicate:



> \*\*"Your second brain is already thinking for you."\*\*

