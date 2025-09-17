/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CBadge,
  CSpinner,
  CAlert,
  CPagination,
  CPaginationItem,
  CInputGroup,
  CFormInput,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPlus,
  cilPencil,
  cilTrash,
  cilSearch,
  cilReload,
  cilInfo,
} from '@coreui/icons'
import { jobsApi } from '../../../api/jobs_api'

const JobsList = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const itemsPerPage = 10

  // Load jobs
  const loadJobs = async (page = 1, search = '') => {
    try {
      setLoading(true)
      setError('')
      const skip = (page - 1) * itemsPerPage
      const response = await jobsApi.getJobs(skip, itemsPerPage)
      
      // Handle response (could be array or object with jobs property)
      let jobsData = Array.isArray(response) ? response : (response.jobs || [])
      
      // Filter jobs based on search and type
      if (search) {
        jobsData = jobsData.filter(job => 
          job.name.toLowerCase().includes(search.toLowerCase()) ||
          (job.description && job.description.toLowerCase().includes(search.toLowerCase()))
        )
      }
      
      if (filterType !== 'all') {
        jobsData = jobsData.filter(job => job.trigger_type === filterType)
      }
      
      setJobs(jobsData)
      setTotalPages(Math.ceil(jobsData.length / itemsPerPage) || 1)
    } catch (err) {
      setError('Failed to load jobs: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  // Delete job
  const handleDelete = async (jobId, jobName) => {
    if (window.confirm(`Are you sure you want to delete job "${jobName}"?`)) {
      try {
        await jobsApi.deleteJob(jobId)
        loadJobs(currentPage, searchTerm)
      } catch (err) {
        setError('Failed to delete job: ' + (err.response?.data?.detail || err.message))
      }
    }
  }

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setCurrentPage(1)
    loadJobs(1, value)
  }

  // Handle filter change
  const handleFilterChange = (type) => {
    setFilterType(type)
    setCurrentPage(1)
    loadJobs(1, searchTerm)
  }

  // Get badge color for trigger type
  const getTriggerTypeBadge = (triggerType) => {
    switch (triggerType) {
      case 'scheduled':
        return 'success'
      case 'source_availability':
        return 'info'
      default:
        return 'secondary'
    }
  }

  // Format trigger type display
  const formatTriggerType = (triggerType) => {
    switch (triggerType) {
      case 'scheduled':
        return 'Scheduled'
      case 'source_availability':
        return 'Source Triggered'
      default:
        return triggerType
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    loadJobs(page, searchTerm)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Jobs Management</strong>
            <CButton
              color="primary"
              onClick={() => navigate('/admin/jobs/create')}
            >
              <CIcon icon={cilPlus} className="me-2" />
              Create Job
            </CButton>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" dismissible onClose={() => setError('')}>
                {error}
              </CAlert>
            )}

            {/* Search and Filter Bar */}
            <CRow className="mb-3">
              <CCol md={6}>
                <CInputGroup>
                  <CFormInput
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <CButton color="outline-secondary" variant="outline">
                    <CIcon icon={cilSearch} />
                  </CButton>
                </CInputGroup>
              </CCol>
              <CCol md={3}>
                <CDropdown>
                  <CDropdownToggle color="outline-secondary">
                    Filter: {filterType === 'all' ? 'All Types' : formatTriggerType(filterType)}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem onClick={() => handleFilterChange('all')}>
                      All Types
                    </CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('scheduled')}>
                      Scheduled
                    </CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('source_availability')}>
                      Source Triggered
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CCol>
              <CCol md={3}>
                <CButton
                  color="outline-secondary"
                  onClick={() => loadJobs(currentPage, searchTerm)}
                  disabled={loading}
                >
                  <CIcon icon={cilReload} className="me-2" />
                  Refresh
                </CButton>
              </CCol>
            </CRow>

            {/* Jobs Table */}
            {loading ? (
              <div className="text-center py-4">
                <CSpinner color="primary" />
                <div className="mt-2">Loading jobs...</div>
              </div>
            ) : (
              <>
                <CTable striped hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell>Description</CTableHeaderCell>
                      <CTableHeaderCell>Type</CTableHeaderCell>
                      <CTableHeaderCell>Callback URL</CTableHeaderCell>
                      <CTableHeaderCell>Sources</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {jobs.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan={6} className="text-center py-4">
                          No jobs found
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      jobs.map((job) => (
                        <CTableRow key={job.id}>
                          <CTableDataCell>
                            <strong>{job.name}</strong>
                          </CTableDataCell>
                          <CTableDataCell>
                            {job.description || '-'}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getTriggerTypeBadge(job.trigger_type)}>
                              {formatTriggerType(job.trigger_type)}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <small>{job.callback_url}</small>
                          </CTableDataCell>
                          <CTableDataCell>
                            {job.sources && job.sources.length > 0 ? (
                              <CBadge color="secondary">
                                {job.sources.length} source(s)
                              </CBadge>
                            ) : (
                              '-'
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-2">
                              <CButton
                                color="info"
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/admin/jobs/view/${job.id}`)}
                                title="View Job"
                              >
                                <CIcon icon={cilInfo} />
                              </CButton>
                              <CButton
                                color="warning"
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/admin/jobs/edit/${job.id}`)}
                                title="Edit Job"
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(job.id, job.name)}
                                title="Delete Job"
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>

                {/* Pagination */}
                {totalPages > 1 && (
                  <CPagination className="justify-content-center mt-3">
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </CPaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <CPaginationItem
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                )}
              </>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default JobsList
