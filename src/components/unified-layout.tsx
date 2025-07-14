'use client'

import React from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface TabItem {
  value: string
  label: string
  icon?: React.ReactNode
  count?: number
}

interface UnifiedTabsProps {
  tabs: TabItem[]
  defaultValue?: string
  className?: string
  children: React.ReactNode
}

export function UnifiedTabs({ tabs, defaultValue, className, children }: UnifiedTabsProps) {
  return (
    <div className={cn("tabs-container", className)}>
      <Tabs defaultValue={defaultValue || tabs[0]?.value} className="w-full">
        <div className="tabs-header">
          <TabsList className="tabs-nav w-full">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value}
                className="tabs-trigger flex-1"
              >
                {tab.icon && <span className="icon">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="ml-2 px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                    {tab.count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="tabs-content">
          {children}
        </div>
      </Tabs>
    </div>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("page-header", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">{title}</h1>
          {description && <p className="page-description">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}

interface SearchFilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  filters?: Array<{
    label: string
    value: string
    active: boolean
    onClick: () => void
  }>
  actions?: React.ReactNode
  className?: string
}

export function SearchFilterBar({ 
  searchValue, 
  onSearchChange, 
  searchPlaceholder = "Search...",
  filters = [],
  actions,
  className 
}: SearchFilterBarProps) {
  return (
    <div className={cn("search-filter-bar", className)}>
      <div className="relative flex-1">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input w-full pl-10"
        />
        <svg 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      {filters.length > 0 && (
        <div className="filter-buttons">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={filter.onClick}
              className={cn(
                "filter-button",
                filter.active && "active"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}
      
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

interface StatsGridProps {
  stats: Array<{
    title: string
    value: string | number
    description?: string
    icon?: React.ReactNode
    trend?: {
      value: string
      positive: boolean
    }
  }>
  className?: string
}

export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <div className={cn("stats-grid", className)}>
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-header">
            <h3 className="stat-title">{stat.title}</h3>
            {stat.icon && <div className="stat-icon">{stat.icon}</div>}
          </div>
          <div className="stat-value">{stat.value}</div>
          {stat.description && <p className="stat-description">{stat.description}</p>}
          {stat.trend && (
            <div className={cn("stat-trend", stat.trend.positive ? "positive" : "negative")}>
              {stat.trend.positive ? "↗" : "↘"}
              {stat.trend.value}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

interface UnifiedPanelProps {
  title: string
  description?: string
  actions?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function UnifiedPanel({ 
  title, 
  description, 
  actions, 
  footer, 
  className, 
  children 
}: UnifiedPanelProps) {
  return (
    <div className={cn("panel-container", className)}>
      <div className="panel-header">
        <div>
          <h2 className="panel-title">{title}</h2>
          {description && <p className="panel-description">{description}</p>}
        </div>
        {actions && <div className="panel-actions">{actions}</div>}
      </div>
      <div className="panel-content">
        {children}
      </div>
      {footer && <div className="panel-footer">{footer}</div>}
    </div>
  )
}

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("page-container", className)}>
      {children}
    </div>
  )
}
