import React, { useState } from 'react'
import { LuMessageSquare, LuPhoneCall, LuSprout, LuUserRound } from 'react-icons/lu'
import MainLayout from '../layouts/MainLayout'
import Button from '../components/Button/Button'
import { useToast } from '../context/ToastContext'
import { contactService } from '../services/contactService'
import './ContactPage.css'

const EMPTY_FORM = {
  full_name: '',
  phone: '',
  email: '',
  address: '',
  subject: '',
  crop_name: '',
  inquiry_type: 'other',
  preferred_contact_time: '',
  message: '',
}

const ContactPage = () => {
  const toast = useToast()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!form.full_name.trim()) nextErrors.full_name = 'Vui lòng nhập họ tên'
    if (!form.phone.trim()) nextErrors.phone = 'Vui lòng nhập số điện thoại'
    if (!form.subject.trim()) nextErrors.subject = 'Vui lòng nhập tiêu đề câu hỏi'
    if (!form.message.trim()) nextErrors.message = 'Vui lòng nhập nội dung câu hỏi'
    if (form.message.trim().length > 0 && form.message.trim().length < 10) {
      nextErrors.message = 'Nội dung cần tối thiểu 10 ký tự'
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = 'Email không hợp lệ'
    }
    return nextErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    try {
      const res = await contactService.submit(form)
      toast.success(res?.message || 'Đã gửi câu hỏi thành công')
      setForm(EMPTY_FORM)
      setErrors({})
    } catch (err) {
      const apiErrors = err?.response?.data?.errors
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        const mapped = {}
        apiErrors.forEach((item) => {
          if (item?.field) mapped[item.field] = item.message
        })
        setErrors((prev) => ({ ...prev, ...mapped }))
      }
      toast.error(err?.response?.data?.message || err?.message || 'Không thể gửi câu hỏi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <div className="contact-page">
        <section className="contact-page__hero">
          <div className="container">
            <h1>
              <LuMessageSquare aria-hidden="true" />
              Liên hệ tư vấn nông nghiệp
            </h1>
            <p>
              Gửi câu hỏi cho quản trị viên và cán bộ khuyến nông để nhận tư vấn về cây trồng,
              sâu bệnh, phân bón và lịch thời vụ phù hợp.
            </p>
          </div>
        </section>

        <section className="container contact-page__body">
          <div className="contact-page__card">
            <h2>Thông tin người liên hệ</h2>
            <form className="contact-page__form" onSubmit={handleSubmit} noValidate>
              <div className="contact-page__grid contact-page__grid--2">
                <label className="contact-page__field">
                  <span>Họ và tên *</span>
                  <input
                    value={form.full_name}
                    onChange={(e) => setField('full_name', e.target.value)}
                    placeholder="Ví dụ: Lò Văn A"
                  />
                  {errors.full_name && <small>{errors.full_name}</small>}
                </label>
                <label className="contact-page__field">
                  <span>Số điện thoại *</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    placeholder="Ví dụ: 0988xxxxxx"
                  />
                  {errors.phone && <small>{errors.phone}</small>}
                </label>
              </div>

              <div className="contact-page__grid contact-page__grid--2">
                <label className="contact-page__field">
                  <span>Email</span>
                  <input
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder="Ví dụ: nongan@example.com"
                  />
                  {errors.email && <small>{errors.email}</small>}
                </label>
                <label className="contact-page__field">
                  <span>Địa chỉ thôn/bản/xã</span>
                  <input
                    value={form.address}
                    onChange={(e) => setField('address', e.target.value)}
                    placeholder="Ví dụ: Bản Chiềng Ly, Thuận Châu"
                  />
                </label>
              </div>

              <div className="contact-page__grid contact-page__grid--2">
                <label className="contact-page__field">
                  <span>Loại câu hỏi</span>
                  <select value={form.inquiry_type} onChange={(e) => setField('inquiry_type', e.target.value)}>
                    <option value="technical">Kỹ thuật chăm sóc</option>
                    <option value="seasonal">Lịch thời vụ</option>
                    <option value="pest">Sâu bệnh</option>
                    <option value="fertilizer">Phân bón</option>
                    <option value="other">Khác</option>
                  </select>
                </label>
                <label className="contact-page__field">
                  <span>Cây trồng liên quan</span>
                  <input
                    value={form.crop_name}
                    onChange={(e) => setField('crop_name', e.target.value)}
                    placeholder="Ví dụ: Lúa nương"
                  />
                </label>
              </div>

              <div className="contact-page__grid contact-page__grid--2">
                <label className="contact-page__field">
                  <span>Tiêu đề câu hỏi *</span>
                  <input
                    value={form.subject}
                    onChange={(e) => setField('subject', e.target.value)}
                    placeholder="Ví dụ: Lúa vàng lá đầu vụ"
                  />
                  {errors.subject && <small>{errors.subject}</small>}
                </label>
                <label className="contact-page__field">
                  <span>Thời gian liên hệ thuận tiện</span>
                  <input
                    value={form.preferred_contact_time}
                    onChange={(e) => setField('preferred_contact_time', e.target.value)}
                    placeholder="Ví dụ: 19h-21h, sau giờ làm"
                  />
                </label>
              </div>

              <label className="contact-page__field">
                <span>Nội dung câu hỏi *</span>
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={(e) => setField('message', e.target.value)}
                  placeholder="Mô tả rõ tình trạng cây, thời điểm phát sinh, biện pháp đã thử..."
                />
                {errors.message && <small>{errors.message}</small>}
              </label>

              <div className="contact-page__actions">
                <Button type="submit" variant="primary" loading={submitting}>
                  Gửi câu hỏi
                </Button>
              </div>
            </form>
          </div>

          <aside className="contact-page__tips">
            <h3>Thông tin nên cung cấp để được tư vấn nhanh</h3>
            <ul>
              <li><LuUserRound aria-hidden="true" /> Họ tên và số điện thoại có thể liên hệ</li>
              <li><LuSprout aria-hidden="true" /> Loại cây trồng và giai đoạn sinh trưởng hiện tại</li>
              <li><LuPhoneCall aria-hidden="true" /> Mô tả triệu chứng sâu bệnh hoặc khó khăn đang gặp</li>
             
            </ul>
          </aside>
        </section>
      </div>
    </MainLayout>
  )
}

export default ContactPage
