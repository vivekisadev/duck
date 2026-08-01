import sys
from PIL import Image
from collections import Counter

def get_dominant_color(image_path):
    img = Image.open(image_path).convert("RGBA")
    pixels = list(img.getdata())
    # Filter out transparent pixels
    solid_pixels = [p[:3] for p in pixels if p[3] > 50]
    if not solid_pixels:
        return (255, 255, 255) # Fallback
    most_common = Counter(solid_pixels).most_common(1)[0][0]
    return most_common

def recolor_image(image_path, target_color, output_path):
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    for item in data:
        # Keep alpha, change RGB
        if item[3] > 0:
            new_data.append((target_color[0], target_color[1], target_color[2], item[3]))
        else:
            new_data.append(item)
    img.putdata(new_data)
    img.save(output_path)
    print(f"Recolored successfully to {target_color}!")

if __name__ == "__main__":
    logo1 = "logo1.png"
    logo2 = "logo2.png"
    out = "logo2_colored.png"
    
    color = get_dominant_color(logo1)
    print(f"Dominant color in logo1: {color}")
    recolor_image(logo2, color, out)
