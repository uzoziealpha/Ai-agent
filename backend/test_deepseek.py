import requests
import json

# DeepSeek API URL and API Key
DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'  # Replace with the correct URL
DEEPSEEK_API_KEY = ''  # Replace with your actual DeepSeek API key

# Example data to send to the DeepSeek API
payload = {
    "model": "deepseek-chat",  # Example model, replace with the correct one
    "messages": [
        {"role": "user", "content": "Once upon a time in a faraway land, there was a dragon."}
    ]
}

headers = {
    'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
    'Content-Type': 'application/json',
}

# Make the request to the DeepSeek API
try:
    response = requests.post(DEEPSEEK_API_URL, json=payload, headers=headers)

    if response.status_code == 200:
        print("Response from DeepSeek API:")
        print(json.dumps(response.json(), indent=2))  # Pretty print the JSON response
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")