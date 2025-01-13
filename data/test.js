// Sample email template with merge fields
export const sampleEmailTemplate = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title>
</title>
<!--[if !mso]><!-->
<meta content="IE=edge" http-equiv="X-UA-Compatible"/>
<!--<![endif]-->
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1" name="viewport"/>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
<!--[if lte mso 11]>
<style type="text/css" data-inliner="ignore">
.mj-outlook-group-fix { width:100% !important; }
</style>
<![endif]-->
<!--[if !mso]><!--><!--<![endif]-->
<style>a:not([name]) {color:#4FBDC8;text-decoration:underline}
a:link {color:#4FBDC8;text-decoration:underline}
a:visited {color:#4FBDC8;text-decoration:underline}
a:active {color:#4FBDC8;text-decoration:underline}
a:hover {color:#4FBDC8;text-decoration:underline}</style><style>@import url(https://static-forms.klaviyo.com/fonts/api/v1/SBKHw4/custom_fonts.css);
#outlook a {
padding: 0
}
body {
margin: 0;
padding: 0;
-webkit-text-size-adjust: 100%;
-ms-text-size-adjust: 100%
}
table, td {
border-collapse: collapse;
mso-table-lspace: 0;
mso-table-rspace: 0
}
img {
border: 0;
line-height: 100%;
outline: none;
text-decoration: none;
-ms-interpolation-mode: bicubic
}
p {
display: block;
margin: 13px 0
}
@media only screen and (min-width: 480px) {
.mj-column-per-100 {
width: 100% !important;
max-width: 100%
}
}
.moz-text-html .mj-column-per-100 {
width: 100% !important;
max-width: 100%
}
@media only screen and (max-width: 480px) {
div.kl-row.colstack div.kl-column {
display: block !important;
width: 100% !important
}
}
.hlb-subblk td {
word-break: normal
}
@media only screen and (max-width: 480px) {
.hlb-wrapper .hlb-block-settings-content {
padding: 9px !important
}
.hlb-logo {
padding-bottom: 9px !important
}
.r2-tbl {
width: 100%
}
.r2-tbl .lnk {
width: 100%
}
.r2-tbl .hlb-subblk:last-child {
padding-right: 0 !important
}
.r2-tbl .hlb-subblk {
padding-right: 10px !important
}
.kl-hlb-stack {
display: block !important;
width: 100% !important;
padding-right: 0 !important
}
.kl-hlb-stack.vspc {
margin-bottom: 9px
}
.kl-hlb-wrap {
display: inline-block !important;
width: auto !important
}
.kl-hlb-no-wrap {
display: table-cell !important
}
.kl-hlb-wrap.nospc.nospc {
padding-right: 0 !important
}
}
@media only screen and (max-width: 480px) {
.component-wrapper .mob-no-spc {
padding-left: 0 !important;
padding-right: 0 !important
}
}
.kl-button a {
display: block !important
}
@media only screen and (max-width: 480px) {
.kl-table-subblock.use-legacy-mobile-padding {
padding-left: 9px !important;
padding-right: 9px !important
}
}
@media only screen and (max-width: 480px) {
.kl-product-cell-stack {
display: block !important;
width: 100% !important;
padding-left: 0 !important;
padding-right: 0 !important
}
}
@media screen and (max-width: 480px) {
.kl-sl-stk {
display: block !important;
width: 100% !important;
padding: 0 0 9px !important;
text-align: center !important
}
.kl-sl-stk.lbls {
padding: 0 !important
}
.kl-sl-stk.spcblk {
display: none !important
}
}
@media only screen and (max-width: 480px) {
table.mj-full-width-mobile {
width: 100% !important
}
td.mj-full-width-mobile {
width: auto !important
}
}
img {
border: 0;
height: auto;
line-height: 100%;
outline: none;
text-decoration: none;
max-width: 100%
}
.root-container {
background-repeat: repeat !important;
background-size: auto !important;
background-position: left top !important
}
.root-container-spacing {
padding-top: 50px !important;
padding-bottom: 20px !important;
font-size: 0 !important
}
.content-padding {
padding-left: 0 !important;
padding-right: 0 !important
}
.content-padding.first {
padding-top: 0 !important
}
.content-padding.last {
padding-bottom: 0 !important
}
@media only screen and (max-width: 480px) {
td.mobile-only {
display: table-cell !important
}
div.mobile-only {
display: block !important
}
table.mobile-only {
display: table !important
}
.desktop-only {
display: none !important
}
}
@media only screen and (max-width: 480px) {
.table-mobile-only {
display: table-cell !important;
max-height: none !important
}
.table-mobile-only.block {
display: block !important
}
.table-mobile-only.inline-block {
display: inline-block !important
}
.table-desktop-only {
max-height: 0 !important;
display: none !important;
mso-hide: all !important;
overflow: hidden !important
}
}
p {
margin-left: 0;
margin-right: 0;
margin-top: 0;
margin-bottom: 0;
padding-bottom: 1em
}
@media only screen and (max-width: 480px) {
body.mce-content-body, /* NOTE: needed for internal tinymce styles */.kl-text > div, .kl-table-subblock div, .kl-split-subblock > div {
font-size: 14px !important;
line-height: 1.3 !important
}
}
h1 {
color: #fafafa;
font-family: "Helvetica Neue", Arial;
font-size: 40px;
font-style: normal;
font-weight: normal;
line-height: 1.1;
letter-spacing: 0;
margin: 0;
margin-bottom: 20px;
text-align: left
}
@media only screen and (max-width: 480px) {
h1 {
font-size: 40px !important;
line-height: 1.1 !important
}
}
h2 {
color: #fafafa;
font-family: "Helvetica Neue", Arial;
font-size: 32px;
font-style: normal;
font-weight: bold;
line-height: 1.1;
letter-spacing: 0;
margin: 0;
margin-bottom: 16px;
text-align: left
}
@media only screen and (max-width: 480px) {
h2 {
font-size: 32px !important;
line-height: 1.1 !important
}
}
h3 {
color: #fafafa;
font-family: "Helvetica Neue", Arial;
font-size: 24px;
font-style: normal;
font-weight: bold;
line-height: 1.1;
letter-spacing: 0;
margin: 0;
margin-bottom: 12px;
text-align: left
}
@media only screen and (max-width: 480px) {
h3 {
font-size: 24px !important;
line-height: 1.1 !important
}
}
h4 {
color: #fafafa;
font-family: "Helvetica Neue", Arial;
font-size: 18px;
font-style: normal;
font-weight: 400;
line-height: 1.1;
letter-spacing: 0;
margin: 0;
margin-bottom: 9px;
text-align: left
}
@media only screen and (max-width: 480px) {
h4 {
font-size: 18px !important;
line-height: 1.1 !important
}
}
@media only screen and (max-width: 480px) {
.root-container {
width: 100% !important
}
.root-container-spacing {
padding: 10px !important
}
.content-padding {
padding-left: 0 !important;
padding-right: 0 !important
}
.content-padding.first {
padding-top: 0 !important
}
.content-padding.last {
padding-bottom: 0 !important
}
.kl-column > .component-wrapper {
padding-left: 0 !important;
padding-right: 0 !important;
width: unset !important
}
.kl-text {
padding-right: 18px !important;
padding-left: 18px !important
}
}</style></head>
<body style="word-spacing:normal;background-color:#f7f7f7;">
<div class="root-container" id="bodyTable" style="background-color:#f7f7f7;">
<div class="root-container-spacing">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="kl-section" role="presentation" style="width:100%;">
<tbody>
<tr>
<td>
<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="kl-section-outlook" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div style="margin:0px auto;max-width:600px;">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
<tbody>
<tr>
<td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;border-radius:0px 0px 0px 0px;max-width:600px;">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;border-radius:0px 0px 0px 0px;">
<tbody>
<tr>
<td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-left:0px;padding-right:0px;padding-top:0px;text-align:center;">
<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><![endif]-->
<div class="content-padding first">
<!--[if true]><table border="0" cellpadding="0" cellspacing="0" width="600" style="width:600px;direction:ltr"><tr><![endif]-->
<div class="kl-row colstack" style="display:table;table-layout:fixed;width:100%;">
<!--[if true]><td style="vertical-align:top;width:600px;"><![endif]-->
<div class="kl-column" style="display:table-cell;vertical-align:top;width:100%;">
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper hlb-wrapper" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="hlb-block-settings-content" style="vertical-align:top;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr>
<td align="top" class="kl-header-link-bar" style="font-size:0px;padding:0px 0px 0px 0px;word-break:break-word;">
<table border="0" cellpadding="0" cellspacing="0" style="color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;border:0;" width="100%">
<tbody>
<tr>
<td align="center" class="hlb-logo" style="display:table-cell;width:100%;padding-bottom:10px;">
<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;">
<tbody>
<tr>
<!--[if true]><td style="width:271px;" bgcolor="transparent"><![endif]-->
<!--[if !true]><!--><td style="width:271px;"><!--<![endif]-->
<a href="{[header_link]}" style="color:#4FBDC8; text-decoration:underline" target="_blank">
<img src="https://d3k81ch9hvuctc.cloudfront.net/company/SBKHw4/images/d2bf89a7-3a68-4e7d-9db8-2023dd88d07a.png" style="display:block;outline:none;text-decoration:none;height:auto;width:100%;background-color:transparent;" width="271"/>
</a>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td>
<table align="center" cellpadding="0" cellspacing="0" class="r2-tbl" style="table-layout:fixed;" width="100%">
<tr style="text-align:center;">
<td align="center" class="kl-hlb-stack block vspc hlb-subblk" style="" valign="middle">
<table border="0" cellpadding="0" cellspacing="0" class="lnk" style="border-collapse:separate;line-height:100%;">
<tr>
<td align="center" bgcolor="transparent" role="presentation" style="border:none;border-radius:5px;cursor:auto;font-style:normal;mso-padding-alt:10px 10px 10px 10px;background:transparent;" valign="middle">
<a href="www.klaviyo.com" style='color:#fafafa; text-decoration:none; display:inline-block; background:transparent; font-family:"Helvetica Neue", Arial; font-size:14px; font-style:normal; font-weight:400; line-height:100%; letter-spacing:0; margin:0; text-transform:none; padding:10px 10px 10px 10px; mso-padding-alt:0; border-radius:5px' target="_blank">
SHOP
</a>
</td>
</tr>
</table>
</td>
<td align="center" class="kl-hlb-stack block vspc hlb-subblk" style="" valign="middle">
<table border="0" cellpadding="0" cellspacing="0" class="lnk" style="border-collapse:separate;line-height:100%;">
<tr>
<td align="center" bgcolor="transparent" role="presentation" style="border:none;border-radius:5px;cursor:auto;font-style:normal;mso-padding-alt:10px 10px 10px 10px;background:transparent;" valign="middle">
<a href="www.klaviyo.com" style='color:#fafafa; text-decoration:none; display:inline-block; background:transparent; font-family:"Helvetica Neue", Arial; font-size:14px; font-style:normal; font-weight:400; line-height:100%; letter-spacing:0; margin:0; text-transform:none; padding:10px 10px 10px 10px; mso-padding-alt:0; border-radius:5px' target="_blank">
ABOUT
</a>
</td>
</tr>
</table>
</td>
<td align="center" class="kl-hlb-stack block vspc hlb-subblk" style="" valign="middle">
<table border="0" cellpadding="0" cellspacing="0" class="lnk" style="border-collapse:separate;line-height:100%;">
<tr>
<td align="center" bgcolor="transparent" role="presentation" style="border:none;border-radius:5px;cursor:auto;font-style:normal;mso-padding-alt:10px 10px 10px 10px;background:transparent;" valign="middle">
<a href="http://www.klaviyo.com" style='color:#fafafa; text-decoration:none; display:inline-block; background:transparent; font-family:"Helvetica Neue", Arial; font-size:14px; font-style:normal; font-weight:400; line-height:100%; letter-spacing:0; margin:0; text-transform:none; padding:10px 10px 10px 10px; mso-padding-alt:0; border-radius:5px' target="_blank">
NEW
</a>
</td>
</tr>
</table>
</td>
<td align="center" class="kl-hlb-stack block hlb-subblk" style="" valign="middle">
<table border="0" cellpadding="0" cellspacing="0" class="lnk" style="border-collapse:separate;line-height:100%;">
<tr>
<td align="center" bgcolor="transparent" role="presentation" style="border:none;border-radius:5px;cursor:auto;font-style:normal;mso-padding-alt:10px 10px 10px 10px;background:transparent;" valign="middle">
<a href="http://www.klaviyo.com" style='color:#fafafa; text-decoration:none; display:inline-block; background:transparent; font-family:"Helvetica Neue", Arial; font-size:14px; font-style:normal; font-weight:400; line-height:100%; letter-spacing:0; margin:0; text-transform:none; padding:10px 10px 10px 10px; mso-padding-alt:0; border-radius:5px' target="_blank">
CONTACT
</a>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="" style="vertical-align:top;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr><td style="color:#fafafa;font-family:'Helvetica Neue', Arial;font-size:14px;line-height:1.3;">{[img_cta]}</td></tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="" style="vertical-align:top;padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr>
<td align="left" class="kl-text" style="font-size:0px;padding:0px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;word-break:break-word;">
<div style="font-family:'Helvetica Neue', Arial;font-size:14px;font-style:normal;font-weight:400;letter-spacing:0px;line-height:1.3;text-align:left;color:#fafafa;"><div style="text-align: center;"><span style="color: #000000;"><span style="font-size: 22px;"><strong>{[Header_text]}</strong></span></span></div></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<!--[if true]></td><![endif]-->
</div>
<!--[if true]></tr></table><![endif]-->
</div>
<!--[if mso | IE]></table><![endif]-->
</td>
</tr>
</tbody>
</table>
</div>
<!--[if mso | IE]></td></tr></table></table><![endif]-->
</td>
</tr>
</tbody>
</table>
</div>
<!--[if mso | IE]></td></tr></table><![endif]-->
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="kl-section" role="presentation" style="width:100%;">
<tbody>
<tr>
<td>
<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="kl-section-outlook" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div style="margin:0px auto;max-width:600px;">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
<tbody>
<tr>
<td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;border-radius:0px 0px 0px 0px;max-width:600px;">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;border-radius:0px 0px 0px 0px;">
<tbody>
<tr>
<td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-left:0px;padding-right:0px;padding-top:0px;text-align:center;">
<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><![endif]-->
<div class="content-padding">
<!--[if true]><table border="0" cellpadding="0" cellspacing="0" width="600" style="width:600px;direction:ltr"><tr><![endif]-->
<div class="kl-row colstack" style="display:table;table-layout:fixed;width:100%;">
<!--[if true]><td style="vertical-align:top;width:600px;"><![endif]-->
<div class="kl-column" style="display:table-cell;vertical-align:top;width:100%;">
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="" style="vertical-align:top;padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr>
<td align="left" class="kl-text" style="font-size:0px;padding:0px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;word-break:break-word;">
<div style="font-family:'Helvetica Neue', Arial;font-size:14px;font-style:normal;font-weight:400;letter-spacing:0px;line-height:1.3;text-align:left;color:#fafafa;"><div style="text-align: center;"><span style="color: #000000;"><span style="font-size: 18px;">{[Header_Description]}</span></span></div></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="" style="vertical-align:top;padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr>
<td align="center" class="kl-button" style="font-size:0px;padding:0px;word-break:break-word;" vertical-align="middle">
<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;line-height:100%;">
<tr>
<td align="center" bgcolor="#0C254D" role="presentation" style="border:none;border-radius:5px;cursor:auto;mso-padding-alt:15px 15px 15px 15px;background:#0C254D;" valign="middle">
<a href="{{button1_link]}" style="color:#FFF; text-decoration:none; display:inline-block; background:#0C254D; font-family:Arial; font-size:16px; font-weight:700; line-height:100%; letter-spacing:0; margin:0; text-transform:none; padding:15px 15px 15px 15px; mso-padding-alt:0; border-radius:5px" target="_blank">
{[Button1_text]}
</a>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="" style="vertical-align:top;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr>
<td style="font-size:0px;word-break:break-word;">
<div style="height:20px;line-height:20px;"> </div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="" style="vertical-align:top;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr>
<td style="font-size:0px;word-break:break-word;">
<div style="height:20px;line-height:20px;"> </div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="" style="vertical-align:top;padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr>
<td align="left" class="kl-text" style="font-size:0px;padding:0px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;word-break:break-word;">
<div style="font-family:'Helvetica Neue', Arial;font-size:14px;font-style:normal;font-weight:400;letter-spacing:0px;line-height:1.3;text-align:left;color:#fafafa;"><div style="text-align: center;"><span style="font-size: 26px; color: rgb(0, 0, 0);"><strong style="color: rgb(0, 0, 0);">{[second_header]}</strong></span></div></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="" style="vertical-align:top;padding-top:18px;padding-right:18px;padding-bottom:18px;padding-left:18px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr>
<td align="center" style="font-size:0px;padding:0px;word-break:break-word;">
<p style="padding-bottom:0; border-top:solid 1px #CCC; font-size:1px; margin:0 auto; width:100%">
</p>
<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #CCCCCC;font-size:1px;margin:0px auto;width:564px;" role="presentation" width="564px" ><tr><td style="height:0;line-height:0;"> &nbsp;
</td></tr></table><![endif]-->
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="" style="vertical-align:top;padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr>
<td align="left" class="kl-table" style="font-size:0px;padding:0px;word-break:break-word;">
<table border="0" cellpadding="0" cellspacing="0" style="color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:fixed;width:100%;border:none;" width="100%">
<thead>
</thead>
<tbody>
<tr>
<td class="kl-table-subblock" style="width:40%;overflow:hidden;vertical-align:top;padding-top:4px;padding-right:0px;padding-bottom:4px;padding-left:0px;">
<div style="font-family:'Helvetica Neue', Arial;font-size:14px;font-style:normal;font-weight:400;letter-spacing:0px;line-height:1.3;text-align:left;color:#fafafa;"><div><span style="color: rgb(0, 0, 0);">{[img_firstBox]}</span></div></div>
</td>
<td class="kl-table-subblock" style="width:auto;overflow:hidden;vertical-align:top;padding-top:4px;padding-right:0px;padding-bottom:4px;padding-left:0px;">
<div style="font-family:'Helvetica Neue', Arial;font-size:14px;font-style:normal;font-weight:400;letter-spacing:0px;line-height:1.3;text-align:left;color:#fafafa;"><div> </div>
<div><span style="font-weight: bold; font-size: 20px; color: rgb(0, 0, 0);">{[first_box_header]}</span></div>
<div><span style="font-size: 18px; color: rgb(0, 0, 0);">[{first_box_description]}</span></div></div>
</td>
</tr>
<tr>
<td class="kl-table-subblock" style="width:40%;overflow:hidden;vertical-align:top;padding-top:4px;padding-right:0px;padding-bottom:4px;padding-left:0px;">
<div style="font-family:'Helvetica Neue', Arial;font-size:14px;font-style:normal;font-weight:400;letter-spacing:0px;line-height:1.3;text-align:left;color:#fafafa;"><div><span style="color: rgb(14, 14, 14);">{[img_secondBox]}</span></div></div>
</td>
<td class="kl-table-subblock" style="width:auto;overflow:hidden;vertical-align:top;padding-top:4px;padding-right:0px;padding-bottom:4px;padding-left:0px;">
<div style="font-family:'Helvetica Neue', Arial;font-size:14px;font-style:normal;font-weight:400;letter-spacing:0px;line-height:1.3;text-align:left;color:#fafafa;"><div style="text-align: left;"><span style="font-weight: bold; font-size: 20px; color: rgb(0, 0, 0);">{[second_box_header]}<br/></span></div>
<div style="text-align: left;"><span style="font-size: 18px; color: rgb(0, 0, 0);">[{second_box_description]}</span></div></div>
</td>
</tr>
<tr>
<td class="kl-table-subblock" style="width:40%;overflow:hidden;vertical-align:top;padding-top:4px;padding-right:0px;padding-bottom:4px;padding-left:0px;">
<div style="font-family:'Helvetica Neue', Arial;font-size:14px;font-style:normal;font-weight:400;letter-spacing:0px;line-height:1.3;text-align:left;color:#fafafa;"><div><span style="color: rgb(12, 12, 12);">{[img_thirdBox]}</span></div></div>
</td>
<td class="kl-table-subblock" style="width:auto;overflow:hidden;vertical-align:top;padding-top:4px;padding-right:0px;padding-bottom:4px;padding-left:0px;">
<div style="font-family:'Helvetica Neue', Arial;font-size:14px;font-style:normal;font-weight:400;letter-spacing:0px;line-height:1.3;text-align:left;color:#fafafa;"><div style="text-align: left;"><span style="font-weight: bold; font-size: 20px; color: rgb(0, 0, 0);">{[third_box_header]}<br/></span></div>
<div style="text-align: left;"><span style="font-size: 18px; color: rgb(0, 0, 0);">{[third_box_description]}</span></div></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="" style="vertical-align:top;padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr>
<td align="center" class="kl-button" style="font-size:0px;padding:0px;word-break:break-word;" vertical-align="middle">
<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;line-height:100%;">
<tr>
<td align="center" bgcolor="#0C254D" role="presentation" style="border:none;border-radius:5px;cursor:auto;mso-padding-alt:15px 15px 15px 15px;background:#0C254D;" valign="middle">
<a href="{[Button_2_link]}" style="color:#FFF; text-decoration:none; display:inline-block; background:#0C254D; font-family:Arial; font-size:16px; font-weight:700; line-height:100%; letter-spacing:0; margin:0; text-transform:none; padding:15px 15px 15px 15px; mso-padding-alt:0; border-radius:5px" target="_blank">
{[Button_2_text]}
</a>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="" style="vertical-align:top;padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr>
<td align="left" style="font-size:0px;padding:0px;word-break:break-word;">
<div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;"><!--[if true]><table class="kl-product" role="presentation" width="100%" style="all:unset;opacity:0;"><tr><![endif]-->
<!--[if false]></td></tr></table><![endif]-->
<div class="kl-product" style="display:table;width:100%;height:100%">
<!--[if true]><td width="33.333333333333336%" style="vertical-align:top;""><![endif]-->
<!--[if !true]><!--><div class="kl-product-cell-stack" style="display:table-cell;vertical-align:top;font-size:0;width:33.333333333333336%;"><!--<![endif]-->
<table cellpadding="0" cellspacing="0" height="100%" role="presentation" style="" width="100%">
<tbody>
<tr>
<td style="font-size:0px;padding:10px 10px 10px 10px;word-break:break-word;vertical-align:top;">{% if feeds.TEST_NAME|index:0 %}
{% with item=feeds.TEST_NAME|index:0%}
{% with Title=item.title|safe Price=item.price|default:"" Compare_at=item.regular_price|default:"" %}

<table align="left" border="0" cellpadding="0" cellspacing="0" class="kl-product-subblock" style="table-layout:fixed;height:100%;" width="100%">
<tbody>
<tr>
<td align="center">
<a href="{{ item.url }}" style="color:#4FBDC8; text-decoration:underline">
<img alt="Image of {{ Title }}" src="{{ item.image_full_url }}" style="display:block;max-width:100%;width:auto;max-height:125px;" width="176"/>
</a>
</td>
</tr>
<tr><td align="center"><table align="center"><tr><td align="center" style="color:#fafafa;font-family:'Helvetica Neue', Arial;font-size:14px;font-weight:700;font-style:normal;text-align:center;letter-spacing:0px;padding-top:5px;padding-bottom:0px;line-height:1.3;">{{ Title }}</td></tr></table></td></tr>
<tr>
<td align="center">
<table align="center">
<tr>
<td align="center" style="color:#fafafa;font-family:'Helvetica Neue', Arial;font-size:14px;font-weight:400;font-style:normal;text-align:center;letter-spacing:0px;padding-top:5px;padding-bottom:0px;padding-left:1.5px;padding-right:1.5px;line-height:1.3;display:inline-block;">{{ Price }}</td>
</tr>
</table></td>
</tr>
<tr><td style="height:100%;"></td></tr>
<tr><td align="center" style="padding-top:9px;">
<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;line-height:100%;">
<tr>
<td align="center" bgcolor="#1155cc" role="presentation" style="border:none;border-radius:5px;cursor:auto;font-style:normal;mso-padding-alt:10px 10px 10px 10px;text-align:center;background:#1155cc;" valign="middle">
<a href="{{ item.url }}" style="color:#FFF; text-decoration:none; display:inline-block; background:#15c; font-family:Arial; font-size:16px; font-style:normal; font-weight:400; line-height:1.3; letter-spacing:0; margin:0; text-transform:none; padding:10px 10px 10px 10px; mso-padding-alt:0; border-radius:5px" target="_blank">
Shop now
</a>
</td>
</tr>
</table>
</td></tr>
</tbody>
</table>

{% endwith %}
{% endwith %}
{% endif %}</td>
</tr>
</tbody>
</table>
<!--[if !true]><!--></div><!--<![endif]-->
<!--[if true]></td><![endif]-->
<!--[if true]><td width="33.333333333333336%" style="vertical-align:top;""><![endif]-->
<!--[if !true]><!--><div class="kl-product-cell-stack" style="display:table-cell;vertical-align:top;font-size:0;width:33.333333333333336%;"><!--<![endif]-->
<table cellpadding="0" cellspacing="0" height="100%" role="presentation" style="" width="100%">
<tbody>
<tr>
<td style="font-size:0px;padding:10px 10px 10px 10px;word-break:break-word;vertical-align:top;">{% if feeds.TEST_NAME|index:1 %}
{% with item=feeds.TEST_NAME|index:1%}
{% with Title=item.title|safe Price=item.price|default:"" Compare_at=item.regular_price|default:"" %}

<table align="left" border="0" cellpadding="0" cellspacing="0" class="kl-product-subblock" style="table-layout:fixed;height:100%;" width="100%">
<tbody>
<tr>
<td align="center">
<a href="{{ item.url }}" style="color:#4FBDC8; text-decoration:underline">
<img alt="Image of {{ Title }}" src="{{ item.image_full_url }}" style="display:block;max-width:100%;width:auto;max-height:125px;" width="176"/>
</a>
</td>
</tr>
<tr><td align="center"><table align="center"><tr><td align="center" style="color:#fafafa;font-family:'Helvetica Neue', Arial;font-size:14px;font-weight:700;font-style:normal;text-align:center;letter-spacing:0px;padding-top:5px;padding-bottom:0px;line-height:1.3;">{{ Title }}</td></tr></table></td></tr>
<tr>
<td align="center">
<table align="center">
<tr>
<td align="center" style="color:#fafafa;font-family:'Helvetica Neue', Arial;font-size:14px;font-weight:400;font-style:normal;text-align:center;letter-spacing:0px;padding-top:5px;padding-bottom:0px;padding-left:1.5px;padding-right:1.5px;line-height:1.3;display:inline-block;">{{ Price }}</td>
</tr>
</table></td>
</tr>
<tr><td style="height:100%;"></td></tr>
<tr><td align="center" style="padding-top:9px;">
<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;line-height:100%;">
<tr>
<td align="center" bgcolor="#1155cc" role="presentation" style="border:none;border-radius:5px;cursor:auto;font-style:normal;mso-padding-alt:10px 10px 10px 10px;text-align:center;background:#1155cc;" valign="middle">
<a href="{{ item.url }}" style="color:#FFF; text-decoration:none; display:inline-block; background:#15c; font-family:Arial; font-size:16px; font-style:normal; font-weight:400; line-height:1.3; letter-spacing:0; margin:0; text-transform:none; padding:10px 10px 10px 10px; mso-padding-alt:0; border-radius:5px" target="_blank">
Shop now
</a>
</td>
</tr>
</table>
</td></tr>
</tbody>
</table>

{% endwith %}
{% endwith %}
{% endif %}</td>
</tr>
</tbody>
</table>
<!--[if !true]><!--></div><!--<![endif]-->
<!--[if true]></td><![endif]-->
<!--[if true]><td width="33.333333333333336%" style="vertical-align:top;""><![endif]-->
<!--[if !true]><!--><div class="kl-product-cell-stack" style="display:table-cell;vertical-align:top;font-size:0;width:33.333333333333336%;"><!--<![endif]-->
<table cellpadding="0" cellspacing="0" height="100%" role="presentation" style="" width="100%">
<tbody>
<tr>
<td style="font-size:0px;padding:10px 10px 10px 10px;word-break:break-word;vertical-align:top;">{% if feeds.TEST_NAME|index:2 %}
{% with item=feeds.TEST_NAME|index:2%}
{% with Title=item.title|safe Price=item.price|default:"" Compare_at=item.regular_price|default:"" %}

<table align="left" border="0" cellpadding="0" cellspacing="0" class="kl-product-subblock" style="table-layout:fixed;height:100%;" width="100%">
<tbody>
<tr>
<td align="center">
<a href="{{ item.url }}" style="color:#4FBDC8; text-decoration:underline">
<img alt="Image of {{ Title }}" src="{{ item.image_full_url }}" style="display:block;max-width:100%;width:auto;max-height:125px;" width="176"/>
</a>
</td>
</tr>
<tr><td align="center"><table align="center"><tr><td align="center" style="color:#fafafa;font-family:'Helvetica Neue', Arial;font-size:14px;font-weight:700;font-style:normal;text-align:center;letter-spacing:0px;padding-top:5px;padding-bottom:0px;line-height:1.3;">{{ Title }}</td></tr></table></td></tr>
<tr>
<td align="center">
<table align="center">
<tr>
<td align="center" style="color:#fafafa;font-family:'Helvetica Neue', Arial;font-size:14px;font-weight:400;font-style:normal;text-align:center;letter-spacing:0px;padding-top:5px;padding-bottom:0px;padding-left:1.5px;padding-right:1.5px;line-height:1.3;display:inline-block;">{{ Price }}</td>
</tr>
</table></td>
</tr>
<tr><td style="height:100%;"></td></tr>
<tr><td align="center" style="padding-top:9px;">
<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;line-height:100%;">
<tr>
<td align="center" bgcolor="#1155cc" role="presentation" style="border:none;border-radius:5px;cursor:auto;font-style:normal;mso-padding-alt:10px 10px 10px 10px;text-align:center;background:#1155cc;" valign="middle">
<a href="{{ item.url }}" style="color:#FFF; text-decoration:none; display:inline-block; background:#15c; font-family:Arial; font-size:16px; font-style:normal; font-weight:400; line-height:1.3; letter-spacing:0; margin:0; text-transform:none; padding:10px 10px 10px 10px; mso-padding-alt:0; border-radius:5px" target="_blank">
Shop now
</a>
</td>
</tr>
</table>
</td></tr>
</tbody>
</table>

{% endwith %}
{% endwith %}
{% endif %}</td>
</tr>
</tbody>
</table>
<!--[if !true]><!--></div><!--<![endif]-->
<!--[if true]></td><![endif]-->
</div>
<!--[if true]></tr></table><![endif]--></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<!--[if true]></td><![endif]-->
</div>
<!--[if true]></tr></table><![endif]-->
<!--[if true]><table border="0" cellpadding="0" cellspacing="0" width="600" style="width:600px;direction:ltr"><tr><![endif]-->
<div class="kl-row colstack" style="display:table;table-layout:fixed;width:100%;">
<!--[if true]><td style="vertical-align:top;width:600px;"><![endif]-->
<div class="kl-column" style="display:table-cell;vertical-align:top;width:100%;">
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="" style="vertical-align:top;padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr>
<td align="center" class="kl-button" style="font-size:0px;padding:0px;word-break:break-word;" vertical-align="middle">
<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;line-height:100%;">
<tr>
<td align="center" bgcolor="#0C254D" role="presentation" style="border:none;border-radius:5px;cursor:auto;mso-padding-alt:15px 15px 15px 15px;background:#0C254D;" valign="middle">
<a href="{[Button_3_link]}" style="color:#FFF; text-decoration:none; display:inline-block; background:#0C254D; font-family:Arial; font-size:16px; font-weight:700; line-height:100%; letter-spacing:0; margin:0; text-transform:none; padding:15px 15px 15px 15px; mso-padding-alt:0; border-radius:5px" target="_blank">
{[Button_3_text]}
</a>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper kl-text-table-layout" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="" style="vertical-align:top;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr>
<td align="center" class="kl-text" style="font-size:0px;padding:0px;padding-top:9px;padding-right:18px;padding-bottom:9px;padding-left:18px;word-break:break-word;">
<div style="font-family:'Helvetica Neue', Arial;font-size:12px;font-style:normal;font-weight:400;letter-spacing:0px;line-height:1.3;text-align:center;color:#727272;">No longer want to receive these emails? {% unsubscribe %}.<br/>
{{ organization.name }} {{ organization.full_address }}</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<div class="mj-column-per-100 mj-outlook-group-fix component-wrapper" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%">
<tbody>
<tr>
<td class="" style="vertical-align:top;padding-top:9px;padding-right:9px;padding-bottom:9px;padding-left:9px;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
<tbody>
<tr>
<td>
<div style="width:100%;text-align:center">
<!--[if true]><table style="all:unset;opacity:0;" border="0" cellpadding="0" cellspacing="0" ><tr><![endif]-->
<!--[if !true]><!--><div class="" style="display:inline-block;padding-right:10px;"><!--<![endif]-->
<!--[if true]><td style="padding-right:10px;"><![endif]-->
<div style="text-align: center;">
<a href="https://www.facebook.com/jaycarelectronics" style="color:#4FBDC8; text-decoration:underline" target="_blank">
<img alt="Facebook" src="https://d3k81ch9hvuctc.cloudfront.net/assets/email/buttons/subtle/facebook_96.png" style="width:32px;" width="32"/>
</a>
</div>
<!--[if true]></td><![endif]-->
<!--[if !true]><!--></div><!--<![endif]-->
<!--[if !true]><!--><div class="" style="display:inline-block;padding-right:10px;"><!--<![endif]-->
<!--[if true]><td style="padding-right:10px;"><![endif]-->
<div style="text-align: center;">
<a href="https://www.youtube.com/JaycarVideo" style="color:#4FBDC8; text-decoration:underline" target="_blank">
<img alt="YouTube" src="https://d3k81ch9hvuctc.cloudfront.net/assets/email/buttons/subtle/youtube_96.png" style="width:32px;" width="32"/>
</a>
</div>
<!--[if true]></td><![endif]-->
<!--[if !true]><!--></div><!--<![endif]-->
<!--[if !true]><!--><div class="" style="display:inline-block;"><!--<![endif]-->
<!--[if true]><td style=""><![endif]-->
<div style="text-align: center;">
<a href="https://www.instagram.com/jaycar_electronics" style="color:#4FBDC8; text-decoration:underline" target="_blank">
<img alt="Instagram" src="https://d3k81ch9hvuctc.cloudfront.net/assets/email/buttons/subtle/instagram_96.png" style="width:32px;" width="32"/>
</a>
</div>
<!--[if true]></td><![endif]-->
<!--[if !true]><!--></div><!--<![endif]-->
<!--[if true]></tr></table><![endif]-->
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<!--[if true]></td><![endif]-->
</div>
<!--[if true]></tr></table><![endif]-->
</div>
<!--[if mso | IE]></table><![endif]-->
</td>
</tr>
</tbody>
</table>
</div>
<!--[if mso | IE]></td></tr></table></table><![endif]-->
</td>
</tr>
</tbody>
</table>
</div>
<!--[if mso | IE]></td></tr></table><![endif]-->
</td>
</tr>
</tbody>
</table>
<!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
<div style="margin:0px auto;max-width:600px;">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
<tbody>
<tr>
<td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
<!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
<div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;vertical-align:top;width:100%;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;width:100%;" width="100%">
<tbody>
<tr>
<td align="center" class="klBranding" style="font-size:0px;padding:25px 0;word-break:break-word;">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
<tbody>
<tr>
<td style="width:122px;">
<a href="https://www.klaviyo.com/?utm_medium=freebie&amp;utm_source=brand&amp;utm_term=SBKHw4" style="color:#4FBDC8; text-decoration:underline" target="_blank">
<img alt="Powered by Klaviyo" height="50" src="https://d3k81ch9hvuctc.cloudfront.net/assets/email/branding/klaviyo-branding-option-0.png" style="border:0;display:block;outline:none;text-decoration:none;height:50px;width:100%;font-size:13px;" width="122"/>
</a>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<!--[if mso | IE]></td></tr></table><![endif]-->
</td>
</tr>
</tbody>
</table>
</div>
<!--[if mso | IE]></td></tr></table><![endif]-->
</div>
</div>
</body>
</html>
`