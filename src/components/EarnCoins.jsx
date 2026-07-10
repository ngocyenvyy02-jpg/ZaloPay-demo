import coin from '../assets/coin.png'
import kxIcon1 from '../assets/kx_icon1.png'
import kxIcon2 from '../assets/kx_icon2.png'

const TASKS = [
  { title: 'Quét QR chuyển khoản', reward: '+Tối đa 3k', icon: kxIcon1 },
  { title: 'Mở tài khoản chứng khoán', reward: '+15.000', icon: kxIcon2 },
  { title: 'Mở tài khoản trả sau', reward: '+5.000', icon: kxIcon1 },
]

export default function EarnCoins() {
  return (
    <section className="earn-section">
      <h2 className="section-title">Kiếm xu mở hộp</h2>

      <div className="earn-scroller">
        {TASKS.map((task) => (
          <article key={task.title} className="earn-card">
            <img className="earn-card__icon" src={task.icon} alt="" />
            <h3 className="earn-card__title">{task.title}</h3>
            <p className="earn-card__reward">
              <img className="earn-card__coin" src={coin} alt="xu" />
              {task.reward}
            </p>
            <button className="earn-card__button">Thực hiện</button>
          </article>
        ))}
      </div>
    </section>
  )
}
