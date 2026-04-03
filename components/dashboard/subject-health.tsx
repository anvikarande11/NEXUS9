'use client'

import { motion } from 'framer-motion'
import { Activity, Shield, Zap, AlertTriangle, TrendingUp, Users, BookOpen, AlertCircle, FileDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboardStore } from '@/lib/store'
import { mockSubjects, type Subject, mockTasks, mockIssues } from '@/lib/mock-data'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InteractiveGlobe } from './3d-globe'
import { useState } from 'react'

function HealthBar({ value, maxValue = 100, color, label }: { 
  value: number; 
  maxValue?: number; 
  color: string;
  label: string;
}) {
  const percentage = (value / maxValue) * 100

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function ShieldMeter({ value }: { value: number }) {
  return (
    <div className="relative w-12 h-12">
      <svg viewBox="0 0 48 48" className="w-full h-full">
        <defs>
          <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M24 4L6 12v12c0 11 8 18 18 22 10-4 18-11 18-22V12L24 4z"
          fill="none"
          stroke="var(--muted)"
          strokeWidth="2"
        />
        <motion.path
          d="M24 4L6 12v12c0 11 8 18 18 22 10-4 18-11 18-22V12L24 4z"
          fill="url(#shield-gradient)"
          fillOpacity={value / 100}
          initial={{ fillOpacity: 0 }}
          animate={{ fillOpacity: value / 100 }}
          transition={{ duration: 0.8 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Shield className="w-5 h-5 text-primary" />
      </div>
    </div>
  )
}

function XPBar({ value, level }: { value: number; level: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-warning" />
          <span className="text-xs font-medium">Level {level}</span>
        </div>
        <span className="text-xs text-muted-foreground">{value}/100 XP</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-warning to-warning/50 rounded-full"
        />
      </div>
    </div>
  )
}

// PDF Generation Function
async function generateAcademicProgressPDF() {
  // Create a new PDF document using jsPDF pattern (browser-compatible)
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  // Calculate overall statistics
  const totalSubjects = mockSubjects.length
  const avgAttendance = Math.round(mockSubjects.reduce((sum, s) => sum + s.attendance, 0) / totalSubjects)
  const avgMarks = Math.round(mockSubjects.reduce((sum, s) => sum + s.marks, 0) / totalSubjects)
  const avgConfidence = Math.round(mockSubjects.reduce((sum, s) => sum + s.revisionConfidence, 0) / totalSubjects)
  const atRiskSubjects = mockSubjects.filter(s => s.riskLevel === 'danger').length
  const warningSubjects = mockSubjects.filter(s => s.riskLevel === 'warning').length
  const safeSubjects = mockSubjects.filter(s => s.riskLevel === 'safe').length
  
  const pendingTasks = mockTasks.length
  const criticalTasks = mockTasks.filter(t => t.urgency === 'critical').length
  const openIssues = mockIssues.filter(i => i.status === 'open' || i.status === 'in-review').length
  
  // Build PDF content as HTML for printing
  const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Academic Progress Report - NEXUS-UNI</title>
  <style>
    @page { margin: 20mm; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #1a1a2e;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header { 
      text-align: center; 
      border-bottom: 3px solid #22c55e; 
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 { 
      color: #0a192f; 
      margin: 0;
      font-size: 28px;
    }
    .header p { 
      color: #666; 
      margin: 5px 0 0 0;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    .summary-card {
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      border-radius: 12px;
      padding: 15px;
      text-align: center;
      border: 1px solid #bae6fd;
    }
    .summary-card .value {
      font-size: 24px;
      font-weight: bold;
      color: #0369a1;
    }
    .summary-card .label {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }
    .section { 
      margin-bottom: 30px; 
    }
    .section h2 { 
      color: #0a192f; 
      border-bottom: 2px solid #22c55e;
      padding-bottom: 8px;
      font-size: 18px;
    }
    .subject-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    .subject-table th, .subject-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    .subject-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #374151;
    }
    .risk-safe { color: #22c55e; font-weight: 600; }
    .risk-warning { color: #f59e0b; font-weight: 600; }
    .risk-danger { color: #ef4444; font-weight: 600; }
    .progress-bar {
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      width: 100px;
      display: inline-block;
      margin-right: 8px;
    }
    .progress-fill {
      height: 100%;
      border-radius: 4px;
    }
    .task-list {
      list-style: none;
      padding: 0;
    }
    .task-list li {
      padding: 10px;
      background: #f8fafc;
      border-left: 3px solid #22c55e;
      margin-bottom: 8px;
      border-radius: 0 8px 8px 0;
    }
    .task-list li.critical { border-left-color: #ef4444; }
    .task-list li.high { border-left-color: #f59e0b; }
    .task-list li.medium { border-left-color: #3b82f6; }
    .recommendations {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #fbbf24;
    }
    .recommendations h3 {
      color: #92400e;
      margin-top: 0;
    }
    .recommendations ul {
      margin: 0;
      padding-left: 20px;
    }
    .recommendations li {
      margin-bottom: 8px;
      color: #78350f;
    }
    .footer {
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>NEXUS-UNI Academic Progress Report</h1>
    <p>Generated on ${currentDate}</p>
  </div>
  
  <div class="summary-grid">
    <div class="summary-card">
      <div class="value">${avgAttendance}%</div>
      <div class="label">Avg. Attendance</div>
    </div>
    <div class="summary-card">
      <div class="value">${avgMarks}%</div>
      <div class="label">Avg. Marks</div>
    </div>
    <div class="summary-card">
      <div class="value">${avgConfidence}%</div>
      <div class="label">Revision Confidence</div>
    </div>
    <div class="summary-card">
      <div class="value">${pendingTasks}</div>
      <div class="label">Pending Tasks</div>
    </div>
  </div>
  
  <div class="section">
    <h2>Subject Performance Overview</h2>
    <table class="subject-table">
      <thead>
        <tr>
          <th>Subject</th>
          <th>Attendance</th>
          <th>Marks</th>
          <th>Confidence</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${mockSubjects.map(subject => `
          <tr>
            <td><strong>${subject.name}</strong><br><small style="color: #666">${subject.code}</small></td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${subject.attendance}%; background: ${subject.attendance >= 75 ? '#22c55e' : subject.attendance >= 50 ? '#f59e0b' : '#ef4444'}"></div>
              </div>
              ${subject.attendance}%
            </td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${subject.marks}%; background: ${subject.marks >= 70 ? '#22c55e' : subject.marks >= 50 ? '#f59e0b' : '#ef4444'}"></div>
              </div>
              ${subject.marks}%
            </td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${subject.revisionConfidence}%; background: #8b5cf6"></div>
              </div>
              ${subject.revisionConfidence}%
            </td>
            <td class="risk-${subject.riskLevel}">${subject.riskLevel.toUpperCase()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="section">
    <h2>Pending Assignments</h2>
    <ul class="task-list">
      ${mockTasks.slice(0, 5).map(task => `
        <li class="${task.urgency}">
          <strong>${task.title}</strong><br>
          <small>Subject: ${task.subject} | Due: ${new Date(task.dueDate).toLocaleDateString()} | Progress: ${task.progress}% | Weight: ${task.gradeWeight}%</small>
        </li>
      `).join('')}
    </ul>
  </div>
  
  <div class="section">
    <h2>Risk Analysis</h2>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
      <div style="background: #dcfce7; padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: bold; color: #22c55e;">${safeSubjects}</div>
        <div style="color: #166534;">Safe Subjects</div>
      </div>
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${warningSubjects}</div>
        <div style="color: #92400e;">Warning Subjects</div>
      </div>
      <div style="background: #fee2e2; padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: bold; color: #ef4444;">${atRiskSubjects}</div>
        <div style="color: #991b1b;">At Risk Subjects</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="recommendations">
      <h3>AI Recommendations</h3>
      <ul>
        ${atRiskSubjects > 0 ? '<li><strong>Urgent:</strong> Focus on subjects marked as "DANGER" - prioritize OS and low-performing subjects</li>' : ''}
        ${avgAttendance < 80 ? '<li>Improve attendance to at least 80% across all subjects for better academic standing</li>' : ''}
        ${criticalTasks > 0 ? `<li>Complete ${criticalTasks} critical task(s) immediately to avoid grade penalties</li>` : ''}
        ${openIssues > 0 ? `<li>Address ${openIssues} open professor feedback issue(s) to improve your standing</li>` : ''}
        ${avgConfidence < 60 ? '<li>Increase revision time - aim for at least 60% confidence across all subjects</li>' : ''}
        <li>Continue using the Class Path feature to track mastery progress</li>
        <li>Schedule regular study sessions using the Focus Mode for better retention</li>
      </ul>
    </div>
  </div>
  
  <div class="footer">
    <p>This report was automatically generated by NEXUS-UNI Academic Dashboard</p>
    <p>For questions or concerns, please contact your academic advisor</p>
  </div>
</body>
</html>
  `
  
  // Open print dialog with the PDF content
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(pdfContent)
    printWindow.document.close()
    printWindow.focus()
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }
  
  return true
}

function SubjectCard({ subject }: { subject: Subject }) {
  const { setCurrentView, setActiveClass, classPaths } = useDashboardStore()
  
  const riskConfig = {
    safe: { icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
    warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
    danger: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' },
  }

  const risk = riskConfig[subject.riskLevel]
  const RiskIcon = risk.icon
  const xpLevel = Math.floor(subject.marks / 20) + 1
  const xpProgress = (subject.marks % 20) * 5

  // Calculate workflow health from ClassPath
  const classPath = classPaths.find(cp => cp.subjectId === subject.id)
  const workflowHealth = classPath 
    ? (classPath.nodes.filter(n => n.completed).length / classPath.nodes.length) * 100
    : 0
  
  const workflowStatus = workflowHealth >= 71 ? 'green' : workflowHealth >= 31 ? 'yellow' : 'red'
  const workflowColor = {
    green: '#22c55e',
    yellow: '#f59e0b',
    red: '#ef4444'
  }[workflowStatus]

  const handleViewClassPath = () => {
    if (classPath) {
      setActiveClass(classPath.id)
      setCurrentView('class-path')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "bg-card border rounded-2xl p-4 transition-all duration-300",
        risk.border,
        subject.riskLevel === 'danger' && "animate-pulse-glow"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar/Icon with color */}
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${subject.color}20` }}
          >
            <span className="text-lg font-bold" style={{ color: subject.color }}>
              {subject.code.slice(0, 2)}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-card-foreground text-sm">
              {subject.name}
            </h4>
            <Badge 
              className={cn("text-xs mt-1", risk.bg, risk.color, "border-0")}
            >
              <RiskIcon className="w-3 h-3 mr-1" />
              {subject.riskLevel.toUpperCase()}
            </Badge>
          </div>
        </div>

        <ShieldMeter value={subject.revisionConfidence} />
      </div>

      {/* Health Bars */}
      <div className="space-y-3">
        <HealthBar 
          value={subject.attendance} 
          color={subject.attendance >= 75 ? '#22c55e' : subject.attendance >= 50 ? '#f59e0b' : '#ef4444'}
          label="Attendance"
        />
        <HealthBar 
          value={subject.marks} 
          color={subject.marks >= 70 ? '#22c55e' : subject.marks >= 50 ? '#f59e0b' : '#ef4444'}
          label="Marks"
        />
        <HealthBar 
          value={subject.revisionConfidence} 
          color="#8b5cf6"
          label="Revision Confidence"
        />

        {/* Workflow Health */}
        {classPath && (
          <HealthBar 
            value={Math.round(workflowHealth)} 
            color={workflowColor}
            label="Workflow Health"
          />
        )}
      </div>

      {/* XP Bar */}
      <div className="mt-4 pt-4 border-t border-border">
        <XPBar value={xpProgress} level={xpLevel} />
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          <span>{subject.pendingTasks} tasks</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>{subject.issueBacklog} issues</span>
        </div>
      </div>

      {/* Class Path Button */}
      {classPath && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewClassPath}
          className="w-full mt-4 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          View Class Path
        </motion.button>
      )}
    </motion.div>
  )
}

export function SubjectHealth() {
  const dangerCount = mockSubjects.filter(s => s.riskLevel === 'danger').length
  const warningCount = mockSubjects.filter(s => s.riskLevel === 'warning').length
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await generateAcademicProgressPDF()
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Subject Health
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gamified academic status tracking with Visual Grade Map
          </p>
        </div>
        <div className="flex items-center gap-3">
          {dangerCount > 0 && (
            <Badge variant="outline" className="text-xs text-destructive border-destructive/30">
              {dangerCount} At Risk
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge variant="outline" className="text-xs text-warning border-warning/30">
              {warningCount} Warning
            </Badge>
          )}
          <Button
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                Export Progress Report
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Interactive 3D Globe */}
      <div className="mb-6">
        <InteractiveGlobe subjects={mockSubjects} />
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSubjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SubjectCard subject={subject} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
