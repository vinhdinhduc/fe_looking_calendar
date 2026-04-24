import React, { useState } from 'react'
import { LuLeaf, LuSprout, LuTriangleAlert } from 'react-icons/lu'
import MainLayout from '../layouts/MainLayout'
import { usePlants, PlantCard, PlantSearch } from '../features/plants'
import { CategoryFilter } from '../features/categories'
import Spinner from '../components/Spinner/Spinner'
import Pagination from '../components/Pagination/Pagination'
import './PlantsPage.css'

const PlantsPage = () => {
  const [searchInput, setSearchInput] = useState('')

  const { plants, total, page, totalPages, loading, error, params, updateParams } = usePlants({
    page: 1, limit: 12,
  })

  const handleSearch = (val) => {
    updateParams({ search: val, page: 1 })
  }

  const handleCategory = (catId) => {
    updateParams({ category_id: catId || undefined, page: 1 })
  }

  return (
    <MainLayout>
      <div className="plants-page">
        {/* Hero strip */}
        <div className="plants-page__hero">
          <div className="container plants-page__hero-inner">
            <h1 className="plants-page__title">
              <LuLeaf aria-hidden="true" />
              Cây trồng tại Thuận Châu
            </h1>
            <p className="plants-page__sub">Tra cứu thông tin, lịch thời vụ và kỹ thuật chăm sóc</p>
            <div className="plants-page__search-wrap">
              <PlantSearch
                value={searchInput}
                onChange={setSearchInput}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="container plants-page__body">
          {/* Filters */}
          <div className="plants-page__filters">
            <CategoryFilter
              selected={params.category_id || null}
              onChange={handleCategory}
            />
          </div>

          {/* Results info */}
          {!loading && !error && (
            <p className="plants-page__count">
              {params.search
                ? `Tìm thấy ${total} kết quả cho "${params.search}"`
                : `${total} cây trồng`}
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <Spinner size="lg" text="Đang tải cây trồng..." />
          ) : error ? (
            <div className="plants-page__error">
              <p>
                <LuTriangleAlert aria-hidden="true" />
                {error}
              </p>
              <button onClick={() => updateParams({ page: 1 })} className="plants-page__retry">
                Thử lại
              </button>
            </div>
          ) : plants.length === 0 ? (
            <div className="plants-page__empty">
              <div className="plants-page__empty-icon" aria-hidden="true">
                <LuSprout />
              </div>
              <p>Không tìm thấy cây trồng phù hợp.</p>
              <button onClick={() => { setSearchInput(''); updateParams({ search: '', category_id: undefined, page: 1 }) }}
                className="plants-page__retry">Xóa bộ lọc</button>
            </div>
          ) : (
            <div className="plants-page__grid">
              {plants.map((plant) => <PlantCard key={plant.id} plant={plant} />)}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => updateParams({ page: p })} />
        </div>
      </div>
    </MainLayout>
  )
}

export default PlantsPage
