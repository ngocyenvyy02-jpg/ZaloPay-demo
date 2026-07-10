import feat1 from '../assets/feat1.png'
import feat2 from '../assets/feat2.png'
import feat3 from '../assets/feat3.png'
import feat4 from '../assets/feat4.png'

const FEATURES = [
  { label: 'Xem Tarot', icon: feat1 },
  { label: 'Quỹ nhóm', icon: feat2 },
  { label: 'Nhận tiền quốc tế', icon: feat3 },
  { label: 'Nhận tiền quốc tế', icon: feat4 },
]

export default function Features() {
  return (
    <section className="features-section">
      <h2 className="section-title">Tính năng đề xuất</h2>

      <div className="features-row">
        {FEATURES.map((feature, index) => (
          <button key={index} className="feature-item">
            <img className="feature-item__icon" src={feature.icon} alt="" />
            <span className="feature-item__label">{feature.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
