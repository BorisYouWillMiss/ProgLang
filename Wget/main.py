import requests
from tqdm import tqdm

chunk_size = 1024
total_size = 0

def download_file(url, filename=''):
    try:
        with requests.get(url) as req:
            global total_size
            total_size = int(req.headers['content-length'])
            with open(filename, 'wb') as f:
                for data in tqdm(iterable = req.iter_content(chunk_size=chunk_size), total = total_size/chunk_size, unit = 'KB'):
                    f.write(data)
            return filename
    except Exception as e:
        print(e)
        return None

print("Enter download link")
downloadLink = input()
print("Enter new name for the file")
file = input()

download_file(downloadLink, file)


