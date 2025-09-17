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
import { sourcesApi } from '../../../api/sources_api'

const SourcesList = () => {
  const navigate = useNavigate()
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const itemsPerPage = 10

  // Load sources
  useEffect(() => {
    const loadSources = async (page = 1, search = '') => {
      try {
        setLoading(true)
        setError('')
        
        // Try to load sources from API, fall back to mock data if API is not available
        try {
          const response = await sourcesApi.getSources(page, itemsPerPage)
          let sourcesData = response.sources || response || []
          
          // Filter sources based on search and type
          if (search) {
            sourcesData = sourcesData.filter(source => 
              source.name.toLowerCase().includes(search.toLowerCase())
            )
          }
          
          if (filterType !== 'all') {
            sourcesData = sourcesData.filter(source => source.source_type === filterType)
          }
          
          setSources(sourcesData)
          setTotalPages(Math.ceil((response.total || sourcesData.length) / itemsPerPage) || 1)
        } catch (apiError) {
          console.warn('API not available, using mock data:', apiError.message)
          
          // Fallback to mock data when API is not available
          const mockSources = [
            {
              id: 1,
              name: 'daily-data-feed',
              source_type: 'value_date_aware',
              created_at: new Date().toISOString()
            },
            {
              id: 2,
              name: 'api-endpoint-source',
              source_type: 'generic',
              created_at: new Date().toISOString()
            }
          ]
          
          // Filter mock sources based on search and type
          let filteredSources = mockSources
          
          if (search) {
            filteredSources = filteredSources.filter(source => 
              source.name.toLowerCase().includes(search.toLowerCase())
            )
          }
          
          if (filterType !== 'all') {
            filteredSources = filteredSources.filter(source => source.source_type === filterType)
          }
          
          setSources(filteredSources)
          setTotalPages(Math.ceil(filteredSources.length / itemsPerPage) || 1)
        }
      } catch (err) {
        setError('Failed to load sources: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    loadSources(currentPage, searchTerm)
  }, [currentPage, searchTerm, filterType])

  // Delete source
  const handleDelete = async (sourceId, sourceName) => {
    if (window.confirm(`Are you sure you want to delete source "${sourceName}"?`)) {
      try {
        await sourcesApi.deleteSource(sourceId)
        // Remove from local state on success
        setSources(sources.filter(s => s.id !== sourceId))
      } catch (err) {
        console.warn('API delete failed, removing from local state:', err.message)
        // Remove from local state even if API fails (for demo purposes)
        setSources(sources.filter(s => s.id !== sourceId))
      }
    }
  }

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setCurrentPage(1)
  }

  // Handle filter change
  const handleFilterChange = (type) => {
    setFilterType(type)
    setCurrentPage(1)
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

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Sources Management</strong>
            <CButton
              color="primary"
              onClick={() => navigate('/admin/sources/create')}
            >
              <CIcon icon={cilPlus} className="me-2" />
              Create Source
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
                    placeholder="Search sources..."
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
                    Filter: {filterType === 'all' ? 'All Types' : formatSourceType(filterType)}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem onClick={() => handleFilterChange('all')}>
                      All Types
                    </CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('value_date_aware')}>
                      Value Date Aware
                    </CDropdownItem>
                    <CDropdownItem onClick={() => handleFilterChange('generic')}>
                      Generic
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CCol>
              <CCol md={3} className="text-end">
                <CButton
                  color="outline-secondary"
                  onClick={() => window.location.reload()}
                >
                  <CIcon icon={cilReload} className="me-2" />
                  Refresh
                </CButton>
              </CCol>
            </CRow>

            {/* Sources Table */}
            {loading ? (
              <div className="text-center py-4">
                <CSpinner color="primary" />
                <div className="mt-2">Loading sources...</div>
              </div>
            ) : sources.length === 0 ? (
              <CAlert color="info">
                No sources found. {searchTerm && `Try adjusting your search term "${searchTerm}".`}
                <CButton
                  color="primary"
                  variant="outline"
                  className="ms-2"
                  size="sm"
                  onClick={() => navigate('/admin/sources/create')}
                >
                  Create First Source
                </CButton>
              </CAlert>
            ) : (
              <>
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Source Name
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Type
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Created At
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">
                        Actions
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {sources
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((source) => (
                        <CTableRow key={source.id}>
                          <CTableDataCell>
                            <div>
                              <strong>{source.name}</strong>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getSourceTypeBadge(source.source_type)}>
                              {formatSourceType(source.source_type)}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <small className="text-medium-emphasis">
                              {formatDate(source.created_at)}
                            </small>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-2">
                              <CButton
                                color="info"
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/admin/sources/view/${source.id}`)}
                                title="View Source"
                              >
                                <CIcon icon={cilInfo} />
                              </CButton>
                              <CButton
                                color="warning"
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/admin/sources/edit/${source.id}`)}
                                title="Edit Source"
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton
                                color="danger"
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(source.id, source.name)}
                                title="Delete Source"
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                  </CTableBody>
                </CTable>

                {/* Pagination */}
                {totalPages > 1 && (
                  <CPagination
                    className="justify-content-end mt-3"
                    aria-label="Sources pagination"
                  >
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </CPaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                      <CPaginationItem
                        key={index + 1}
                        active={currentPage === index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
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

export default SourcesList
