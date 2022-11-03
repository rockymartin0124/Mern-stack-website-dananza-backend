Table users{
  id int [pk]
  email varchar
  business_name varchar
  password varchar
  customer_id varchar unique
  profile_id varchar unique
  f_name varchar
  l_name varchar
  profile_avatar varchar
}

Table buyer_profile{
  id int [pk]
  UserId int
  location varchar
  profession varchar
  has_seller_acct tinyint
  profile_description blob
  signup_date datetime
}

Table social_accounts{
  id int [pk]
  BuyerProfileId int
  media_type varchar
  username varchar
  linked_account varchar
  website varchar  
}

Table saved_adza{
  id int [pk]
  BuyerProfileId int
  AdzaProfileId int  
  ListingId int
  save_time date
}

Table campaigns{
  id int [pk]
  BuyerProfileId int
  campaign_name varchar
  campaign_status varchar
  campaign_price float
  OrderId int
}

Table campaign_listings{
  id int [pk]
  CampaignId int
  AdzaProfileId int
  ListingId int
  add_time datetime
}

Table adza_profile{
  id int [pk]
  UserId int
  profile_photo varchar
  profile_description blob
  review_point float
  signup_date datetime
  image_gallery json
  audience_male_percent float
  audience_age_min int
  audience_age_max int
  audience_locations varchar
  audience_interests varchar
  update_time datetime
}

Table sessions{
  id int [pk]
  BuyerProfileId int
  adza_result_click tinyint
  adza_profile_id int
  adza_page_interaction tinyint
  page_action varchar
  page_addtocart tinyint
  action_choose_date tinyint
  ation_expandchannel tinyint
  actions_expandlisting tinyint
  action_galleryscroll tinyint
  action_profilesaved tinyint
  action_morereviews tinyint
}

Table reviews{
  id int [pk]
  AdzaProfileId int
  BuyerProfileId int
  review_point float
  review_description varchar
  review_date datetime
}

Table channels{
  id int [pk]
  AdzaProfileId int
  media_type varchar
  follows int
  username varchar
  linked_channel varchar
  add_time datetime
  active tinyint
}

Table listings{
  id int [pk]
  AdzaProfileId int
  ChannelId int
  media_type varchar
  title varchar
  price float
  featured_photo varchar
  description varchar
  insert_date datetime
}

Table messages{
  id int [pk]
  BuyerProfileId int
  AdzaProfileId int
  message_text varchar
  message_time date
  is_new tinyint
}

Table carts{
  id int [pk]
  CampaignId int
  subtotal float
}

Table orders{
  id int [pk]
  BuyerProfileId int
  CampaignId int
  order_status varchar
  order_date date
}

Table order_history{
  id int [pk]
  OrderId int
  order_comment varchar
  order_status varchar
  update_time date  
}

Table blogs{
  id int [pk]
  title varchar
  content varchar
  post_time datetime
  featured_image varchar
  active tinyint
}

Table audience_keywords{
  id int [pk]
  keyword varchar
  active tinyint
}

Ref: users.id > buyer_profile.UserId
Ref: buyer_profile.id > social_accounts.BuyerProfileId
Ref: saved_adza.BuyerProfileId > buyer_profile.id
Ref: saved_adza.AdzaProfileId > adza_profile.id
Ref: saved_adza.ListingId > listings.id
Ref: campaigns.BuyerProfileId > buyer_profile.id
Ref: campaign_listings.CampaignId > campaigns.id
Ref: campaign_listings.AdzaProfileId > adza_profile.id
Ref: campaign_listings.ListingId > listings.id
Ref: users.id > adza_profile.UserId
Ref: reviews.AdzaProfileId > adza_profile.id
Ref: reviews.BuyerProfileId > buyer_profile.id
Ref: channels.AdzaProfileId > adza_profile.id
Ref: listings.AdzaProfileId > adza_profile.id
Ref: listings.ChannelId > channels.id
Ref: messages.BuyerProfileId > buyer_profile.id
Ref: messages.AdzaProfileId > adza_profile.id
Ref: carts.CampaignId > campaigns.id
Ref: orders.CampaignId > campaigns.id
Ref: sessions.BuyerProfileId > buyer_profile.id
Ref: sessions.adza_profile_id > adza_profile.id

