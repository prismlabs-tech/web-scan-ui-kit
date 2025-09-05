import React from 'react'
import { useTranslation } from 'react-i18next'
import { BottomBannerContainer, Confetti } from '../components/'
import Banner from '../components/Banner'

interface ProcessingScreenProps {
  onClose: () => void
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ onClose }) => {
  const { t } = useTranslation()

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Confetti />
      {/* Place additional content in here */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: '20vh' }}>
        {/* You can add any other content here if needed */}
      </div>
      <BottomBannerContainer>
        <Banner
          title={t('finished.title')}
          bottomTitle={t('finished.description')}
          buttonText={t('finished.viewResults')}
          onButtonClick={onClose}
        />
      </BottomBannerContainer>
    </div>
  )
}

export default ProcessingScreen
