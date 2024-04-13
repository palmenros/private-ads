from flask import Flask, request

app = Flask(__name__)

# Map from 'adURL' -> "addContent"
ads = {}

@app.route("/ad/post", methods=['POST'])
def add_ad():
    url = request.form.get('url')
    content = request.form.get('content')

    if url in ads:
        print(f'Trying to post an ad to an already existing URL: "{url}"')
        return 'Ad already exists!', 400
    else:
        ads[url] = content
        print(f'Posted ad at URL "{url}" with content "{content}"')
        return 'OK', 200

@app.route("/ad/retrieve", methods=['POST'])
def retrieve_ad():
    url = request.form.get('url')

    if url in ads:
        content = ads[url]
        print(f'Read ad at URL "{url}" with content "{content}"')
        return content
    else:
        print(f'Ad at URL "{url}" does not exist!')
        return 'Ad not found', 404