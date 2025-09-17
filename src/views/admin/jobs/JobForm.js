/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
  CButton,
  CAlert,
  CSpinner,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSave,
  cilArrowLeft,
} from '@coreui/icons'
import { jobsApi } from '../../../api/jobs_api'
import { sourcesApi } from '../../../api/sources_api'
import { scheduleApi } from '../../../api/schedule_api'

const JobForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    callback_url: '',
    trigger_type: 'scheduled'
  })
  
  const [scheduleData, setScheduleData] = useState({
    cron_expression: '',
    timezone: 'UTC'
  })
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load job data for editing
  useEffect(() => {
    const loadJobData = async () => {
      try {
        setLoading(true)
        console.log('Loading job with ID:', id) // Debug log
        const job = await jobsApi.getJobById(id)
        console.log('Loaded job data:', job) // Debug log
        setFormData({
          name: job.name || '',
          description: job.description || '',
          callback_url: job.callback_url || '',
          trigger_type: job.trigger_type || 'scheduled'
        })
        
        if (job.schedule) {
          setScheduleData({
            cron_expression: job.schedule.cron_expression || '',
            timezone: job.schedule.timezone || 'UTC'
          })
        }
      } catch (err) {
        console.error('Error loading job:', err) // Debug log
        setError('Failed to load job: ' + (err.response?.data?.detail || err.message))
      } finally {
        setLoading(false)
      }
    }

    console.log('JobForm useEffect - isEdit:', isEdit, 'id:', id) // Debug log
    if (isEdit) {
      loadJobData()
    }
  }, [id, isEdit])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleScheduleChange = (e) => {
    const { name, value } = e.target
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Job name is required')
      return false
    }
    if (!formData.callback_url.trim()) {
      setError('Callback URL is required')
      return false
    }
    try {
      new URL(formData.callback_url)
    } catch {
      setError('Please enter a valid URL for callback')
      return false
    }
    if (formData.trigger_type === 'scheduled' && !scheduleData.cron_expression.trim()) {
      setError('Cron expression is required for scheduled jobs')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      
      let job
      if (isEdit) {
        // For edit, we need to update - assuming there's an update method
        // Since the API doesn't have update, we'll show a message
        setError('Edit functionality requires an update API endpoint')
        return
      } else {
        // Create new job
        job = await jobsApi.createJob(formData)
        
        // Set schedule if it's a scheduled job
        if (formData.trigger_type === 'scheduled' && scheduleData.cron_expression) {
          await jobsApi.setJobSchedule(job.id, scheduleData)
        }
      }
      
      setSuccess(`Job ${isEdit ? 'updated' : 'created'} successfully!`)
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/admin/jobs')
      }, 1500)
      
    } catch (err) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} job: ` + (err.response?.data?.detail || err.message))
    } finally {
      setSaving(false)
    }
  }

  const commonCronExpressions = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every 5 minutes', value: '*/5 * * * *' },
    { label: 'Every 15 minutes', value: '*/15 * * * *' },
    { label: 'Every 30 minutes', value: '*/30 * * * *' },
    { label: 'Hourly', value: '0 * * * *' },
    { label: 'Daily at 9 AM', value: '0 9 * * *' },
    { label: 'Daily at midnight', value: '0 0 * * *' },
    { label: 'Weekly (Monday 9 AM)', value: '0 9 * * 1' },
    { label: 'Monthly (1st day 9 AM)', value: '0 9 1 * *' },
  ]

  if (loading) {
    return (
      <div className="text-center py-4">
        <CSpinner color="primary" />
        <div className="mt-2">Loading job...</div>
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>{isEdit ? 'Edit Job' : 'Create Job'}</strong>
            <CButton
              color="secondary"
              variant="outline"
              onClick={() => navigate('/admin/jobs')}
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Back to Jobs
            </CButton>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" dismissible onClose={() => setError('')}>
                {error}
              </CAlert>
            )}
            
            {success && (
              <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                {success}
              </CAlert>
            )}

            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="name">Job Name *</CFormLabel>
                    <CFormInput
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter job name"
                      required
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel htmlFor="trigger_type">Trigger Type *</CFormLabel>
                    <CFormSelect
                      id="trigger_type"
                      name="trigger_type"
                      value={formData.trigger_type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="source_availability">Source Availability</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              <div className="mb-3">
                <CFormLabel htmlFor="description">Description</CFormLabel>
                <CFormTextarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter job description"
                />
              </div>

              <div className="mb-3">
                <CFormLabel htmlFor="callback_url">Callback URL *</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>🔗</CInputGroupText>
                  <CFormInput
                    type="url"
                    id="callback_url"
                    name="callback_url"
                    value={formData.callback_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/webhook"
                    required
                  />
                </CInputGroup>
              </div>

              {/* Schedule Settings for Scheduled Jobs */}
              {formData.trigger_type === 'scheduled' && (
                <CCard className="mb-3">
                  <CCardHeader>
                    <strong>Schedule Settings</strong>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol md={8}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="cron_expression">Cron Expression *</CFormLabel>
                          <CFormInput
                            type="text"
                            id="cron_expression"
                            name="cron_expression"
                            value={scheduleData.cron_expression}
                            onChange={handleScheduleChange}
                            placeholder="0 9 * * * (Daily at 9 AM)"
                            required
                          />
                          <small className="text-muted">
                            Format: minute hour day month weekday
                          </small>
                        </div>
                      </CCol>
                      <CCol md={4}>
                        <div className="mb-3">
                          <CFormLabel htmlFor="timezone">Timezone</CFormLabel>
                          <CFormSelect
                            id="timezone"
                            name="timezone"
                            value={scheduleData.timezone}
                            onChange={handleScheduleChange}
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">EST (New York)</option>
                            <option value="America/Chicago">CST (Chicago)</option>
                            <option value="America/Denver">MST (Denver)</option>
                            <option value="America/Los_Angeles">PST (Los Angeles)</option>
                            <option value="Europe/London">GMT (London)</option>
                            <option value="Europe/Paris">CET (Paris)</option>
                            <option value="Asia/Tokyo">JST (Tokyo)</option>
                          </CFormSelect>
                        </div>
                      </CCol>
                    </CRow>
                    
                    {/* Common Cron Expressions */}
                    <div className="mb-2">
                      <strong>Common Schedules:</strong>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {commonCronExpressions.map((expr, index) => (
                        <CButton
                          key={index}
                          color="outline-secondary"
                          size="sm"
                          onClick={() => setScheduleData(prev => ({ ...prev, cron_expression: expr.value }))}
                        >
                          {expr.label}
                        </CButton>
                      ))}
                    </div>
                  </CCardBody>
                </CCard>
              )}

              <div className="d-flex gap-2">
                <CButton
                  type="submit"
                  color="primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      {isEdit ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilSave} className="me-2" />
                      {isEdit ? 'Update Job' : 'Create Job'}
                    </>
                  )}
                </CButton>
                <CButton
                  type="button"
                  color="secondary"
                  onClick={() => navigate('/admin/jobs')}
                  disabled={saving}
                >
                  Cancel
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default JobForm
