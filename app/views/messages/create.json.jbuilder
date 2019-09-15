json.user_name  @message.user.name
json.created_at @message.created_at.to_s if @message.created_at.present?
json.content    @message.content
json.image      @message.image
json.image_url  @message.image.url
json.id         @message.id