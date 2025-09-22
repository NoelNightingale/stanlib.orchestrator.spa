/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CSpinner,
  CAlert,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilArrowLeft,
  cilPencil,
  cilMediaPlay,
  cilTrash,
  cilReload,
  cilClock,
  cilCheckCircle,
  cilXCircle,
  cilWarning,
  cilLink,
  cilLinkBroken,
  cilPlus,
} from '@coreui/icons'
import { jobsApi } from '../../../api/jobs_api'
import { sourcesApi } from '../../../api/sources_api'

const JobDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [executions, setExecutions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('details')
  const [executing, setExecuting] = useState(false)
  const [allSources, setAllSources] = useState([])
  const [jobSources, setJobSources] = useState([])
  const [showSourceModal, setShowSourceModal] = useState(false)
  const [selectedSources, setSelectedSources] = useState([])
  const [sourcesLoading, setSourcesLoading] = useState(false)

  useEffect(() => {
    const loadJobData = async () => {
      try {
        setLoading(true)
        const jobData = await jobsApi.getJobById(id)
        setJob(jobData)
      } catch (err) {
        setError('Failed to load job: ' + (err.response?.data?.detail || err.message))
      } finally {
        setLoading(false)
      }
    }

    const loadExecutions = async () => {
      try {
        const executionData = await jobsApi.getJobExecutions(id)
        setExecutions(executionData)
      } catch (err) {
        console.error('Failed to load executions:', err)
        // Non-blocking error for executions
      }
    }

    const loadJobSources = async () => {
      try {
        const sourcesData = await jobsApi.getJobSources(id)
        setJobSources(sourcesData)
      } catch (err) {
        console.error('Failed to load job sources:', err)
        // Non-blocking error for job sources
      }
    }

    loadJobData()
    loadExecutions()
    loadJobSources()
  }, [id])

  const loadExecutions = async () => {
    try {
      const executionData = await jobsApi.getJobExecutions(id)
      setExecutions(executionData)
    } catch (err) {
      console.error('Failed to load executions:', err)
      // Non-blocking error for executions
    }
  }

  const handleExecuteJob = async () => {
    try {
      setExecuting(true)
      setError('')
      await jobsApi.executeJob(id)
      setSuccess('Job execution started successfully!')
      // Reload executions after a short delay
      setTimeout(() => {
        loadExecutions()
      }, 2000)
    } catch (err) {
      setError('Failed to execute job: ' + (err.response?.data?.detail || err.message))
    } finally {
      setExecuting(false)
    }
  }

  const handleDeleteJob = async () => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await jobsApi.deleteJob(id)
        setSuccess('Job deleted successfully!')
        setTimeout(() => {
          navigate('/admin/jobs')
        }, 1500)
      } catch (err) {
        setError('Failed to delete job: ' + (err.response?.data?.detail || err.message))
      }
    }
  }

  const loadAllSources = async () => {
    try {
      const sourcesData = await sourcesApi.getSources()
      setAllSources(sourcesData)
    } catch (err) {
      console.error('Failed to load sources:', err)
      setAllSources([])
    }
  }

  const handleManageSources = async () => {
    setSourcesLoading(true)
    await loadAllSources()
    
    // Pre-select currently associated sources
    const currentSourceIds = job.sources?.map(s => s.id) || []
    setSelectedSources(currentSourceIds)
    setShowSourceModal(true)
    setSourcesLoading(false)
  }

  const handleSourceToggle = (sourceId) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    )
  }

  const handleSaveSourceAssociations = async () => {
    try {
      setSourcesLoading(true)
      setError('')
      
      await jobsApi.associateSourcesToJob(id, selectedSources)
      
      // Reload job sources to get updated list
      const sourcesData = await jobsApi.getJobSources(id)
      setJobSources(sourcesData)
      
      setSuccess('Source associations updated successfully!')
      setShowSourceModal(false)
    } catch (err) {
      setError('Failed to update source associations: ' + (err.response?.data?.detail || err.message))
    } finally {
      setSourcesLoading(false)
    }
  }

  const handleRemoveSource = async (sourceId) => {
    if (window.confirm('Are you sure you want to remove this source association?')) {
      try {
        const currentSourceIds = job.sources?.map(s => s.id) || []
        const newSourceIds = currentSourceIds.filter(id => id !== sourceId)
        
        await jobsApi.associateSourcesToJob(id, newSourceIds)
        
        // Reload job data
        const jobData = await jobsApi.getJobById(id)
        setJob(jobData)
        
        setSuccess('Source association removed successfully!')
      } catch (err) {
        setError('Failed to remove source association: ' + (err.response?.data?.detail || err.message))
      }
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'warning', icon: cilClock },
      running: { color: 'info', icon: cilMediaPlay },
      completed: { color: 'success', icon: cilCheckCircle },
      failed: { color: 'danger', icon: cilXCircle },
      cancelled: { color: 'secondary', icon: cilXCircle },
    }
    
    const statusInfo = statusMap[status?.toLowerCase()] || { color: 'secondary', icon: cilWarning }
    
    return (
      <CBadge color={statusInfo.color}>
        <CIcon icon={statusInfo.icon} size="sm" className="me-1" />
        {status}
      </CBadge>
    )
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }

  const formatDuration = (startTime, endTime) => {
    if (!startTime) return 'N/A'
    if (!endTime) return 'In progress...'
    
    const start = new Date(startTime)
    const end = new Date(endTime)
    const duration = end - start
    
    if (duration < 1000) return `${duration}ms`
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`
    return `${(duration / 60000).toFixed(1)}m`
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <CSpinner color="primary" />
        <div className="mt-2">Loading job details...</div>
      </div>
    )
  }

  if (!job) {
    return (
      <CAlert color="danger">
        Job not found or failed to load.
      </CAlert>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{job.name}</strong>
              <div className="text-muted small">{job.description || 'No description'}</div>
            </div>
            <div className="d-flex gap-2">
              <CButton
                color="success"
                variant="outline"
                onClick={handleExecuteJob}
                disabled={executing}
              >
                {executing ? (
                  <CSpinner size="sm" className="me-2" />
                ) : (
                  <CIcon icon={cilMediaPlay} className="me-2" />
                )}
                Execute Now
              </CButton>
              <CButton
                color="primary"
                variant="outline"
                onClick={() => navigate(`/admin/jobs/${id}/edit`)}
              >
                <CIcon icon={cilPencil} className="me-2" />
                Edit
              </CButton>
              <CButton
                color="danger"
                variant="outline"
                onClick={handleDeleteJob}
              >
                <CIcon icon={cilTrash} className="me-2" />
                Delete
              </CButton>
              <CButton
                color="secondary"
                variant="outline"
                onClick={() => navigate('/admin/jobs')}
              >
                <CIcon icon={cilArrowLeft} className="me-2" />
                Back
              </CButton>
            </div>
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

            <CNav variant="tabs" className="mb-3">
              <CNavItem>
                <CNavLink
                  active={activeTab === 'details'}
                  onClick={() => setActiveTab('details')}
                  style={{ cursor: 'pointer' }}
                >
                  Job Details
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'sources'}
                  onClick={() => setActiveTab('sources')}
                  style={{ cursor: 'pointer' }}
                >
                  Sources ({job.sources?.length || 0})
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'executions'}
                  onClick={() => setActiveTab('executions')}
                  style={{ cursor: 'pointer' }}
                >
                  Execution History ({executions.length})
                </CNavLink>
              </CNavItem>
            </CNav>

            <CTabContent>
              <CTabPane visible={activeTab === 'details'}>
                <CRow>
                  <CCol md={6}>
                    <CCard>
                      <CCardHeader>
                        <strong>Basic Information</strong>
                      </CCardHeader>
                      <CCardBody>
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <td><strong>ID:</strong></td>
                              <td>{job.id}</td>
                            </tr>
                            <tr>
                              <td><strong>Name:</strong></td>
                              <td>{job.name}</td>
                            </tr>
                            <tr>
                              <td><strong>Description:</strong></td>
                              <td>{job.description || 'No description'}</td>
                            </tr>
                            <tr>
                              <td><strong>Trigger Type:</strong></td>
                              <td>
                                <CBadge color={job.trigger_type === 'scheduled' ? 'info' : 'warning'}>
                                  {job.trigger_type}
                                </CBadge>
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Callback URL:</strong></td>
                              <td>
                                <a href={job.callback_url} target="_blank" rel="noopener noreferrer">
                                  {job.callback_url}
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td><strong>Status:</strong></td>
                              <td>{getStatusBadge(job.status)}</td>
                            </tr>
                            <tr>
                              <td><strong>Created:</strong></td>
                              <td>{formatDateTime(job.created_at)}</td>
                            </tr>
                            <tr>
                              <td><strong>Updated:</strong></td>
                              <td>{formatDateTime(job.updated_at)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  
                  {job.trigger_type === 'scheduled' && job.schedule && (
                    <CCol md={6}>
                      <CCard>
                        <CCardHeader>
                          <strong>Schedule Information</strong>
                        </CCardHeader>
                        <CCardBody>
                          <table className="table table-borderless">
                            <tbody>
                              <tr>
                                <td><strong>Cron Expression:</strong></td>
                                <td><code>{job.schedule.cron_expression}</code></td>
                              </tr>
                              <tr>
                                <td><strong>Timezone:</strong></td>
                                <td>{job.schedule.timezone}</td>
                              </tr>
                              <tr>
                                <td><strong>Next Run:</strong></td>
                                <td>{formatDateTime(job.schedule.next_run_time)}</td>
                              </tr>
                              <tr>
                                <td><strong>Last Run:</strong></td>
                                <td>{formatDateTime(job.schedule.last_run_time)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  )}
                </CRow>
              </CTabPane>

              <CTabPane visible={activeTab === 'executions'}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Execution History</h5>
                  <CButton
                    color="secondary"
                    variant="outline"
                    size="sm"
                    onClick={loadExecutions}
                  >
                    <CIcon icon={cilReload} className="me-2" />
                    Refresh
                  </CButton>
                </div>
                
                {executions.length === 0 ? (
                  <CAlert color="info">
                    No execution history available for this job.
                  </CAlert>
                ) : (
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Execution ID</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Started</CTableHeaderCell>
                        <CTableHeaderCell>Completed</CTableHeaderCell>
                        <CTableHeaderCell>Duration</CTableHeaderCell>
                        <CTableHeaderCell>Result</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {executions.map((execution) => (
                        <CTableRow key={execution.id}>
                          <CTableDataCell>
                            <code>{execution.id}</code>
                          </CTableDataCell>
                          <CTableDataCell>
                            {getStatusBadge(execution.status)}
                          </CTableDataCell>
                          <CTableDataCell>
                            {formatDateTime(execution.start_time)}
                          </CTableDataCell>
                          <CTableDataCell>
                            {formatDateTime(execution.end_time)}
                          </CTableDataCell>
                          <CTableDataCell>
                            {formatDuration(execution.start_time, execution.end_time)}
                          </CTableDataCell>
                          <CTableDataCell>
                            {execution.result ? (
                              <CBadge color="success">Success</CBadge>
                            ) : execution.error_message ? (
                              <CBadge color="danger" title={execution.error_message}>
                                Error
                              </CBadge>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
              </CTabPane>

              <CTabPane visible={activeTab === 'sources'}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Associated Sources</h5>
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={handleManageSources}
                    disabled={sourcesLoading}
                  >
                    <CIcon icon={cilPlus} className="me-1" />
                    Manage Sources
                  </CButton>
                </div>

                {jobSources.length > 0 ? (
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow color="light">
                        <CTableHeaderCell>Source Name</CTableHeaderCell>
                        <CTableHeaderCell>Type</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {jobSources.map((source) => (
                        <CTableRow key={source.id}>
                          <CTableDataCell>
                            <strong>{source.name}</strong>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={source.source_type === 'database' ? 'info' : 'secondary'}>
                              {source.source_type}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={source.status === 'active' ? 'success' : 'danger'}>
                              {source.status}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="danger"
                              variant="outline"
                              size="sm"
                              onClick={() => handleSourceToggle(source.id, false)}
                              title="Remove association"
                            >
                              <CIcon icon={cilLinkBroken} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                ) : (
                  <CAlert color="info">
                    <CIcon icon={cilLink} className="me-2" />
                    No sources are currently associated with this job. Click "Manage Sources" to add associations.
                  </CAlert>
                )}
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Source Management Modal */}
      <CCol xs={12}>
    <CModal visible={showSourceModal} onClose={() => setShowSourceModal(false)} size="lg">
      <CModalHeader>
        <CModalTitle>Manage Job Sources</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="mb-3">
          <p className="text-muted">
            Select sources to associate with this job. Sources can be linked or unlinked as needed.
          </p>
        </div>

        {sourcesLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <CForm>
            {allSources.map((source) => (
              <CFormCheck
                key={source.id}
                id={`source-${source.id}`}
                label={
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                      <strong>{source.name}</strong>
                      <div className="text-muted small">
                        Type: {source.source_type} | Status: {source.status}
                      </div>
                    </div>
                    <CBadge 
                      color={selectedSources.includes(source.id) ? 'success' : 'secondary'}
                    >
                      {selectedSources.includes(source.id) ? 'Linked' : 'Available'}
                    </CBadge>
                  </div>
                }
                checked={selectedSources.includes(source.id)}
                onChange={(e) => handleSourceToggle(source.id, e.target.checked)}
              />
            ))}
          </CForm>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={() => setShowSourceModal(false)}
        >
          Cancel
        </CButton>
        <CButton 
          color="primary" 
          onClick={handleSaveSourceAssociations}
          disabled={sourcesLoading}
        >
          Save Changes
        </CButton>
      </CModalFooter>
    </CModal>
      </CCol>
    </CRow>
  )
}

export default JobDetails
