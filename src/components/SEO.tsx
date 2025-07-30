import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  canonical?: string;
  tags?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title = 'Hues Apply - Find Jobs, Scholarships & Grants | AI-Powered Career Platform',
  description = 'Discover thousands of jobs, scholarships, and grants tailored for you. AI-powered career platform helping students and professionals find opportunities worldwide.',
  keywords = 'scholarships, grants, jobs, career opportunities, remote jobs, student scholarships, job search, career platform, AI career matching, education funding',
  image = '/hero/hues_apply_logo.svg',
  url = 'https://huesapply.com',
  type = 'website',
  canonical
}) => {
  const fullUrl = canonical || `${url}${window.location.pathname}`;
  const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Hues Apply" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    </Helmet>
  );
};

export default SEO;
