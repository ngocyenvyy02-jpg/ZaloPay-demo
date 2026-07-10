import offerArt from '../assets/offer_art.png'

export default function Offers() {
  return (
    <section className="offers-section">
      <h2 className="section-title">Ưu đãi đang diễn ra</h2>

      <article className="offer-card">
        <div className="offer-card__body">
          <h3 className="offer-card__title">Quét QR chuyển tiền ngân hàng</h3>
          <p className="offer-card__subtitle">Nhận ngay quà trị giá đến 300k</p>
        </div>
        <img className="offer-card__art" src={offerArt} alt="" />
      </article>
    </section>
  )
}
