import ContentLoader from 'react-content-loader';

const ProductPlaceholder = ({ ...rest }) => (
  <ContentLoader
    viewBox="0 0 100 88"
    backgroundColor="#e5e7eb"
    foregroundColor="#d1d5db"
    {...rest}
  >
    <rect x="0" y="0" rx="2" ry="2" width="100" height="72" />
    <rect x="0" y="75" rx="2" ry="2" width="100" height="10" />
  </ContentLoader>
);

export default ProductPlaceholder;