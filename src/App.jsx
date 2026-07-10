import { useState } from 'react'
import StatusBar from './components/StatusBar.jsx'
import MysteryBoxCard from './components/MysteryBoxCard.jsx'
import GiftGrid from './components/GiftGrid.jsx'
import EarnCoins from './components/EarnCoins.jsx'
import Features from './components/Features.jsx'
import Offers from './components/Offers.jsx'
import { ClockIcon, CloseIcon } from './components/Icons.jsx'
import heroTop from './assets/hero_top.png'
import coin from './assets/coin.png'

const VERSIONS = [1, 2]

const NOTES = {
  1: {
    title: 'Nhận xét — Version 1',
    body: 'Tò mò về hộp, nhưng tò mò không đủ mạnh để làm một hành động tốn công như quét QR chuyển khoản. Ngoài ra có 3 điểm bấm gần nhau (2 chữ "Mở hộp" + 1 nút to) → phân vân nên bấm cái nào.',
  },
  2: {
    title: 'Nhận xét — Version 2',
    body: 'Hiệu ứng hộp quà nổi bật hơn, nhưng nếu mở trang này quá lâu và tần suất hộp nhảy liên tục thì có thể gây khó chịu đối với một số users nhạy cảm chuyển động. → Đã thêm rule: sau 10s dừng ở màn hình, animation hộp và ánh sáng nút tự nghỉ 5s rồi chạy lại 5s xen kẽ để tránh spam.',
  },
}

export default function App() {
  const [version, setVersion] = useState(1)
  const note = NOTES[version]

  return (
    <>
      <div className="config-tabs">
        <span className="config-tabs__label">Hộp Mù</span>
        <div className="config-tabs__group">
          {VERSIONS.map((v) => (
            <button
              key={v}
              className={`config-tabs__tab${version === v ? ' config-tabs__tab--active' : ''}`}
              onClick={() => setVersion(v)}
            >
              Version {v}
            </button>
          ))}
        </div>
      </div>

      <div className="stage">
        <aside className="annotation" key={version}>
          <span className="annotation__pin" />
          <h3 className="annotation__title">{note.title}</h3>
          <p className="annotation__body">{note.body}</p>
        </aside>

        <div className="mockup">
          <div className="mockup__notch" />

          <div className="mockup__screen">
            <header className="hero">
              <StatusBar />
              <img className="hero__image" src={heroTop} alt="Quét QR ngân hàng - Hoa hậu Phương Linh" />
            </header>

            <main className="sheet">
              <button className="sheet__close" aria-label="Đóng">
                <CloseIcon />
              </button>
              <h1 className="sheet__title">
                Quét QR chuyển khoản
                <br />
                Tích xu - Đổi siêu quà
              </h1>

              <div className="quick-row">
                <button className="quick-row__reward">
                  Bạn có 1.000
                  <img className="quick-row__coin" src={coin} alt="xu" />
                </button>
                <span className="quick-row__divider" />
                <button className="quick-row__link">Hướng dẫn</button>
                <span className="quick-row__divider" />
                <button className="quick-row__link">
                  Lịch sử <ClockIcon />
                </button>
              </div>

              <MysteryBoxCard variant={version} />
              <GiftGrid />
              <EarnCoins />
              <Features />
              <Offers />
            </main>
          </div>

          <div className="home-indicator" />
        </div>
      </div>
    </>
  )
}
