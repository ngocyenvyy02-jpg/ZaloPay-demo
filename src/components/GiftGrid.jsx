import pTrangDiem from '../assets/p_trangdiem.png'
import pDji from '../assets/p_dji.png'
import pCombo from '../assets/p_combo.png'
import pVali from '../assets/p_vali.png'
import pTuiXach from '../assets/p_tuixach.png'
import pGay from '../assets/p_gay.png'
import pTuiDeoCheo from '../assets/p_tuideocheo.png'
import pChiet from '../assets/p_chiet.png'

const GIFTS = [
  { name: 'Bộ trang điểm du lịch', image: pTrangDiem },
  { name: 'DJI Osmo Pocket', image: pDji },
  { name: 'Combo Kính bơi', image: pCombo },
  { name: 'Vali du lịch cao cấp', image: pVali },
  { name: 'Túi xách đan thủ công', image: pTuiXach },
  { name: 'Gậy chụp ảnh ba chân', image: pGay },
  { name: 'Túi đeo chéo da', image: pTuiDeoCheo },
  { name: 'Bộ chiết mỹ phẩm', image: pChiet },
]

export default function GiftGrid() {
  return (
    <section className="gift-section">
      <h2 className="section-title">Quà độc quyền Cửa hàng QR</h2>
      <p className="section-subtitle">Quà được thêm mới mỗi ngày</p>

      <div className="gift-grid">
        {GIFTS.map((gift) => (
          <button key={gift.name} className="gift-card">
            <img className="gift-card__image" src={gift.image} alt={gift.name} />
            <span className="gift-card__body">
              <span className="gift-card__name">{gift.name}</span>
              <span className="gift-card__note">Quét QR chuyển khoản để đổi</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
