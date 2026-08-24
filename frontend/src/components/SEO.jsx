import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url }) => {
  const siteTitle = 'ShopPilot - Your Ultimate E-commerce Destination';
  const defaultDescription = 'ShopPilot offers the best products across electronics, fashion, home, and more. Enjoy seamless shopping, fast delivery, and premium quality.';
  const defaultImage = 'https://shoppilot.demo/pwa-512x512.jpg'; // Placeholder for default share image
  const defaultUrl = 'https://shoppilot.demo'; // Placeholder for default site URL

  const seoTitle = title ? `${title} | ShopPilot` : siteTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url || defaultUrl;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seoUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={seoImage} />
    </Helmet>
  );
};

export default SEO;
