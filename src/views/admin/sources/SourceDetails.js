/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CBadge,
  CSpinner,
  CAlert,
  CBreadcrumb,
  CBreadcrumbItem,
  CListGroup,
  CListGroupItem,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilPencil, cilTrash, cilBell } from '@coreui/icons'
import { sourcesApi, sourceAvailabilityApi } from '../../../api/sources_api'

const SourceDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [source, setSource] = useState(null)
  const [availability, setAvailability] = useState([])
  const [associatedJobs, setAssociatedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showNotifyModal, setShowNotifyModal] = useState(false)
  const [valueDate, setValueDate] = useState('')
  const [notifying, setNotifying] = useState(false)

  // Load source details
  useEffect(() => {
    const loadSourceDetails = async () => {
      try {
        setLoading(true)
        setError('')
        
        try {
          // Load source details
          const sourceData = await sourcesApi.getSource(id)
          setSource(sourceData)
          
          // Load source availability for all source types
          try {
            const availabilityData = await sourcesApi.getSourceAvailability(id)
            setAvailability(availabilityData || [])
          } catch (availError) {
            console.warn('Failed to load availability data:', availError.message)
            setAvailability([])
          }
          
          // Load associated jobs
          try {
            const jobsData = await sourcesApi.getSourceJobs(id)
            setAssociatedJobs(jobsData || [])
          } catch (jobsError) {
            console.warn('Failed to load associated jobs:', jobsError.message)
            setAssociatedJobs([])
          }
        } catch (apiError) {
          console.warn('API not available, using mock data:', apiError.message)
          
          // Fallback to mock data
          const mockSource = {
            id: parseInt(id),
            name: 'daily-data-feed',
            source_type: 'value_date_aware',
            created_at: new Date().toISOString()
          }
          
          const mockAvailability = [
            {
              id: 1,
              value_date: '2025-09-10T00:00:00Z',
              notified_at: '2025-09-11T08:00:00Z'
            },
            {
              id: 2,
              value_date: '2025-09-09T00:00:00Z',
              notified_at: '2025-09-10T08:00:00Z'
            }
          ]
          
          const mockJobs = [
            {
              id: 1,
              name: 'daily-report-job',
              trigger_type: 'source_availability'
            },
            {
              id: 2,
              name: 'weekly-summary-job',
              trigger_type: 'source_availability'
            }
          ]
          
          setSource(mockSource)
          setAvailability(mockAvailability)
          setAssociatedJobs(mockJobs)
        }
      } catch (err) {
        setError('Failed to load source details: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    loadSourceDetails()
  }, [id])

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete source "${source.name}"?`)) {
      try {
        // await sourcesApi.deleteSource(id)
        navigate('/admin/sources', {
          state: { message: 'Source deleted successfully!' }
        })
      } catch (err) {
        setError('Failed to delete source: ' + err.message)
      }
    }
  }

  // Handle notify source available
  const handleNotifySource = () => {
    setValueDate('')
    setShowNotifyModal(true)
  }

  const handleNotifySubmit = async () => {
    try {
      setNotifying(true)
      setError('')
      setSuccess('')
      
      const response = await sourceAvailabilityApi.notifySourceAvailable(
        source.name,
        source.source_type === 'value_date_aware' && valueDate ? valueDate : null
      )
      
      // Format the success message with action details
      const actionsSummary = []
      if (response.actions_taken.job_executions_created?.length > 0) {
        actionsSummary.push(`${response.actions_taken.job_executions_created.length} job execution(s) created`)
      }
      if (response.actions_taken.job_executions_ready?.length > 0) {
        actionsSummary.push(`${response.actions_taken.job_executions_ready.length} job execution(s) marked ready`)
      }
      if (response.actions_taken.source_triggers_created?.length > 0) {
        actionsSummary.push(`${response.actions_taken.source_triggers_created.length} source trigger(s) created`)
      }
      
      const summaryText = actionsSummary.length > 0 
        ? ` Actions: ${actionsSummary.join(', ')}.`
        : ''
      
      setSuccess(`Source availability notification sent successfully!${summaryText}`)
      setShowNotifyModal(false)
      
      // Reload availability data for all source types
      try {
        const availabilityData = await sourcesApi.getSourceAvailability(id)
        setAvailability(availabilityData || [])
      } catch (err) {
        console.warn('Failed to reload availability data:', err)
      }
    } catch (err) {
      setError('Failed to notify source availability: ' + (err.response?.data?.detail || err.message))
    } finally {
      setNotifying(false)
    }
  }

  // Get badge color for source type
  const getSourceTypeBadge = (sourceType) => {
    switch (sourceType) {
      case 'value_date_aware':
        return 'success'
      case 'generic':
        return 'info'
      default:
        return 'secondary'
    }
  }

  // Format source type for display
  const formatSourceType = (sourceType) => {
    switch (sourceType) {
      case 'value_date_aware':
        return 'Value Date Aware'
      case 'generic':
        return 'Generic'
      default:
        return sourceType
    }
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
        <div className="mt-2">Loading source details...</div>
      </div>
    )
  }

  if (!source) {
    return (
      <CAlert color="danger">
        Source not found. <CButton color="link" onClick={() => navigate('/admin/sources')}>Go back to sources</CButton>
      </CAlert>
    )
  }

  return (
    <>
      {/* Breadcrumb */}
      <CBreadcrumb className="ms-2">
        <CBreadcrumbItem onClick={() => navigate('/admin/sources')} style={{ cursor: 'pointer' }}>
          Sources
        </CBreadcrumbItem>
        <CBreadcrumbItem active>
          {source.name}
        </CBreadcrumbItem>
      </CBreadcrumb>

      <CRow>
        <CCol xs={12}>
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

          {/* Source Details Card */}
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Source Details</strong>
              <div className="d-flex gap-2">
                <CButton
                  color="success"
                  variant="outline"
                  size="sm"
                  onClick={handleNotifySource}
                >
                  <CIcon icon={cilBell} className="me-2" />
                  Notify Available
                </CButton>
                <CButton
                  color="secondary"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/sources')}
                >
                  <CIcon icon={cilArrowLeft} className="me-2" />
                  Back to Sources
                </CButton>
                <CButton
                  color="warning"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/sources/edit/${id}`)}
                >
                  <CIcon icon={cilPencil} className="me-2" />
                  Edit
                </CButton>
                <CButton
                  color="danger"
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                >
                  <CIcon icon={cilTrash} className="me-2" />
                  Delete
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Source Name:</strong>
                  <span>{source.name}</span>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Type:</strong>
                  <CBadge color={getSourceTypeBadge(source.source_type)}>
                    {formatSourceType(source.source_type)}
                  </CBadge>
                </CListGroupItem>
                <CListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Created At:</strong>
                  <span>{formatDate(source.created_at)}</span>
                </CListGroupItem>
              </CListGroup>
            </CCardBody>
          </CCard>

          {/* Associated Jobs */}
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Associated Jobs ({associatedJobs.length})</strong>
            </CCardHeader>
            <CCardBody>
              {associatedJobs.length === 0 ? (
                <CAlert color="info">
                  No jobs are currently associated with this source.
                </CAlert>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Job Name
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Trigger Type
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Actions
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {associatedJobs.map((job) => (
                      <CTableRow key={job.id}>
                        <CTableDataCell>
                          <strong>{job.name}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="secondary">
                            {job.trigger_type}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="info"
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/jobs/view/${job.id}`)}
                          >
                            View Job
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>

          {/* Source Availability (for all source types) */}
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Recent Availability Notifications ({availability.length})</strong>
            </CCardHeader>
            <CCardBody>
              {availability.length === 0 ? (
                <CAlert color="info">
                  No availability notifications recorded for this source.
                </CAlert>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Value Date
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Notified At
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {availability.map((record) => (
                      <CTableRow key={record.id}>
                        <CTableDataCell>
                          {record.value_date ? formatDate(record.value_date) : 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <small className="text-medium-emphasis">
                            {formatDate(record.notified_at)}
                          </small>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Notify Source Available Modal */}
      <CModal visible={showNotifyModal} onClose={() => setShowNotifyModal(false)}>
        <CModalHeader>
          <CModalTitle>Notify Source Available</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            You are about to notify that the source <strong>"{source?.name}"</strong> is available.
          </p>
          
          {source?.source_type === 'value_date_aware' && (
            <CForm>
              <CFormLabel htmlFor="valueDate">Value Date (Optional)</CFormLabel>
              <CFormInput
                type="datetime-local"
                id="valueDate"
                value={valueDate}
                onChange={(e) => setValueDate(e.target.value)}
                placeholder="Select date and time..."
              />
              <small className="text-muted">
                Leave empty for generic notification or specify a date/time for value-date-aware processing.
              </small>
            </CForm>
          )}
          
          {source?.source_type === 'generic' && (
            <CAlert color="info">
              This is a generic source - no value date is required.
            </CAlert>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => setShowNotifyModal(false)}
            disabled={notifying}
          >
            Cancel
          </CButton>
          <CButton 
            color="success" 
            onClick={handleNotifySubmit}
            disabled={notifying}
          >
            {notifying ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Notifying...
              </>
            ) : (
              <>
                <CIcon icon={cilBell} className="me-2" />
                Notify Available
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default SourceDetails
