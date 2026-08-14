const PDFDocument = require('pdfkit');

/**
 * Generate PDF Invoice and pipe it to the response stream
 * @param {Object} order - The populated Order document
 * @param {Object} user - The user document
 * @param {Object} res - Express response object
 */
const generateInvoice = (order, user, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // Set up response headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);

  // Pipe the PDF directly to the response
  doc.pipe(res);

  // --- Header ---
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text('ShopPilot', 50, 57)
    .fontSize(10)
    .text('123 Commerce St.', 200, 50, { align: 'right' })
    .text('Mumbai, MH 400001, India', 200, 65, { align: 'right' })
    .text('Email: support@shoppilot.com', 200, 80, { align: 'right' })
    .moveDown();

  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 105).lineTo(550, 105).stroke();

  // --- Order Information ---
  doc
    .fontSize(16)
    .text('INVOICE', 50, 120)
    .fontSize(10)
    .text(`Order Number: ${order.orderNumber}`, 50, 140)
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 155)
    .text(`Status: ${order.orderStatus.toUpperCase()}`, 50, 170)
    .text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 50, 185);

  // --- Billing / Shipping Addresses ---
  const shipping = order.shippingAddress;
  
  doc
    .text('Billed To:', 300, 140)
    .font('Helvetica-Bold')
    .text(user.firstName + ' ' + user.lastName, 300, 155)
    .font('Helvetica')
    .text(user.email, 300, 170)
    .text(shipping.phoneNumber, 300, 185);

  doc
    .text('Shipped To:', 430, 140)
    .font('Helvetica-Bold')
    .text(shipping.fullName, 430, 155)
    .font('Helvetica')
    .text(shipping.addressLine1, 430, 170)
    .text(`${shipping.city}, ${shipping.state} - ${shipping.postalCode}`, 430, 185)
    .text(shipping.country, 430, 200);

  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 230).lineTo(550, 230).stroke();

  // --- Items Table Header ---
  const invoiceTableTop = 260;

  doc.font('Helvetica-Bold');
  doc.text('Item', 50, invoiceTableTop);
  doc.text('Description', 150, invoiceTableTop);
  doc.text('Unit Cost', 380, invoiceTableTop, { width: 50, align: 'right' });
  doc.text('Quantity', 430, invoiceTableTop, { width: 50, align: 'center' });
  doc.text('Total', 490, invoiceTableTop, { width: 60, align: 'right' });

  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, invoiceTableTop + 15).lineTo(550, invoiceTableTop + 15).stroke();

  // --- Items ---
  doc.font('Helvetica');
  let position = invoiceTableTop + 30;

  order.items.forEach((item, i) => {
    // Determine the price used (use discounted price if available)
    const unitPrice = item.discountedPrice || item.price || 0;
    const subtotal = item.subtotal || (unitPrice * item.quantity) || 0;
    
    // Add page if position is too low
    if (position > 700) {
      doc.addPage();
      position = 50;
    }

    doc.text(i + 1, 50, position);
    doc.text(item.productTitle || 'Product', 150, position, { width: 220 });
    doc.text(`INR ${unitPrice.toLocaleString()}`, 380, position, { width: 50, align: 'right' });
    doc.text(item.quantity, 430, position, { width: 50, align: 'center' });
    doc.text(`INR ${subtotal.toLocaleString()}`, 490, position, { width: 60, align: 'right' });
    
    position += 20;
  });

  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, position + 10).lineTo(550, position + 10).stroke();

  // --- Totals ---
  const subtotalPosition = position + 30;
  
  doc.font('Helvetica');
  doc.text('Subtotal:', 380, subtotalPosition, { width: 100, align: 'right' });
  doc.text(`INR ${order.subtotal?.toLocaleString() || 0}`, 490, subtotalPosition, { width: 60, align: 'right' });
  
  doc.text('Discount:', 380, subtotalPosition + 20, { width: 100, align: 'right' });
  doc.text(`- INR ${order.discount?.toLocaleString() || 0}`, 490, subtotalPosition + 20, { width: 60, align: 'right' });
  
  doc.text('Tax (18%):', 380, subtotalPosition + 40, { width: 100, align: 'right' });
  doc.text(`INR ${order.tax?.toLocaleString() || 0}`, 490, subtotalPosition + 40, { width: 60, align: 'right' });
  
  doc.text('Shipping:', 380, subtotalPosition + 60, { width: 100, align: 'right' });
  doc.text(`INR ${order.shippingCharge?.toLocaleString() || 0}`, 490, subtotalPosition + 60, { width: 60, align: 'right' });

  doc.font('Helvetica-Bold');
  doc.text('Grand Total:', 380, subtotalPosition + 90, { width: 100, align: 'right' });
  doc.text(`INR ${order.totalAmount?.toLocaleString() || 0}`, 490, subtotalPosition + 90, { width: 60, align: 'right' });
  
  // Footer
  doc.fontSize(10).text(
    'Thank you for your business. For any queries, contact support@shoppilot.com.',
    50,
    700,
    { align: 'center', width: 500 }
  );

  doc.end();
};

module.exports = {
  generateInvoice
};
