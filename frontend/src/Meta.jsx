import {Helmet} from 'react-helmet-async'

const Meta = ({title, description, keywords}) => {
  return (
      <Helmet>
          <title>{title}</title>
          <meta name='description' content={description} />
          <meta name='keywords' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
    title: 'Welcome to Proshop',
    description: 'We sell best product',
    keywords: 'Electronic, Phone, PC, Laptop'
}

export default Meta