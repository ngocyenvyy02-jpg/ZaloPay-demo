import { useEffect, useState } from 'react'
import { EyeIcon, QrScanIcon } from './Icons.jsx'
import boxQua from '../assets/box_qua.png'
import boxDeal from '../assets/box_deal.png'
import brandsBand from '../assets/brands_band.png'
import coin from '../assets/coin.png'

const V2_REWARDS = [
  { value: '35.000', turns: '(1 lượt)', affordable: false },
  { value: '300', turns: '(2 lượt)', affordable: true },
]

// Sau 10s dừng ở màn hình, animation nghỉ/chạy xen kẽ mỗi 5s để tránh spam
const INITIAL_MS = 10000
const ACTIVE_MS = 5000
const REST_MS = 5000

export default function MysteryBoxCard({ variant = 1 }) {
  const isV2 = variant === 2
  const [resting, setResting] = useState(false)

  useEffect(() => {
    if (!isV2) return undefined

    setResting(false) // vào Version 2: 10s đầu luôn chạy đầy đủ
    const timeouts = []
    const rest = () => {
      setResting(true)
      timeouts.push(setTimeout(run, REST_MS))
    }
    const run = () => {
      setResting(false)
      timeouts.push(setTimeout(rest, ACTIVE_MS))
    }
    timeouts.push(setTimeout(rest, INITIAL_MS))

    return () => timeouts.forEach(clearTimeout)
  }, [isV2])

  const className = [
    'mystery-card',
    isV2 && 'mystery-card--v2',
    isV2 && resting && 'mystery-card--resting',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={className}>
      <h2 className="mystery-card__title">
        <span className="mystery-card__sparkle">✨</span>{' '}
        {isV2 ? 'Săn quà Hè Năng Động' : 'Hộp Mù See & Scan'}{' '}
        <span className="mystery-card__sparkle">✨</span>
      </h2>
      {isV2 ? (
        <p className="mystery-card__subtitle">Bạn còn đổi được 3 hộp nữa trong tuần này</p>
      ) : (
        <p className="mystery-card__subtitle">
          Nhấn vào hộp để xem quà <EyeIcon />
        </p>
      )}

      <div className="mystery-card__boxes">
        <div className="mystery-card__box-wrap">
          <img className="mystery-card__box" src={boxQua} alt="Hộp mù Siêu Quà" />
        </div>
        <div className="mystery-card__box-wrap mystery-card__box-wrap--alt">
          {isV2 && <span className="mystery-card__badge">Đủ xu để mở</span>}
          <img className="mystery-card__box" src={boxDeal} alt="Hộp mù Siêu Deal" />
        </div>
      </div>

      {isV2 ? (
        <div className="mystery-card__actions">
          {V2_REWARDS.map((reward) => (
            <div key={reward.value} className="mystery-card__reward">
              <p className="mystery-card__reward-row">
                <img className="mystery-card__reward-coin" src={coin} alt="xu" />
                <strong>{reward.value}</strong>
                <span>{reward.turns}</span>
              </p>
              <p className="mystery-card__hint">Chạm để xem quà</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mystery-card__actions">
          <button className="mystery-card__open">Mở hộp</button>
          <button className="mystery-card__open">Mở hộp</button>
        </div>
      )}

      <img className="mystery-card__brands" src={brandsBand} alt="POP MART, Zalopay, CGV, Starbucks, GOOJODOQ, UNIQLO, COLORKEY, L'ORÉAL" />

      <button className="mystery-card__cta">
        <QrScanIcon />
        {isV2 ? 'Quét QR chuyển khoản kiếm xu' : 'Quét QR chuyển khoản để mở'}
      </button>

      {!isV2 && <span className="mystery-card__shine" aria-hidden="true" />}
    </section>
  )
}
