import os
from PIL import Image, ImageDraw, ImageFont

def generate_sample_land_record(output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    width = 1000
    height = 1400
    
    # 1. Parchment paper background
    image = Image.new("RGB", (width, height), color=(252, 250, 242))
    draw = ImageDraw.Draw(image)

    # 2. Outer decorative borders
    draw.rectangle([(20, 20), (width - 20, height - 20)], outline=(120, 80, 40), width=4)
    draw.rectangle([(28, 28), (width - 28, height - 28)], outline=(180, 140, 90), width=2)
    draw.rectangle([(34, 34), (width - 34, height - 34)], outline=(120, 80, 40), width=1)

    # 3. Header Seal / Emblem circle
    draw.ellipse([(width // 2 - 45, 50), (width // 2 + 45, 140)], outline=(180, 100, 30), width=3)
    draw.text((width // 2 - 25, 75), "GOVT", fill=(180, 100, 30))
    draw.text((width // 2 - 35, 100), "REVENUE", fill=(180, 100, 30))

    # Header Text
    draw.text((width // 2 - 220, 160), "GOVERNMENT OF HARYANA / हरियाणा सरकार", fill=(40, 40, 40))
    draw.text((width // 2 - 200, 190), "DEPARTMENT OF REVENUE AND DISASTER MANAGEMENT", fill=(60, 60, 60))
    draw.text((width // 2 - 170, 220), "KHASRA KHATOUNI / खसरा-खतौनी (FORM 7/12)", fill=(130, 40, 20))

    draw.line([(60, 255), (width - 60, 255)], fill=(150, 100, 50), width=2)

    # Document Metadata Header
    draw.text((70, 280), "Deed Serial No: HR-GGM-2026-40222", fill=(50, 50, 50))
    draw.text((650, 280), "Date: 12/05/2023", fill=(50, 50, 50))
    draw.text((70, 310), "District: Gurugram (गुडगाँव)", fill=(50, 50, 50))
    draw.text((650, 310), "Tehsil: Gurugram Sadar", fill=(50, 50, 50))
    draw.text((70, 340), "Village: Khandsa (खांडसा)", fill=(50, 50, 50))
    draw.text((650, 340), "State: Haryana (हरियाणा)", fill=(50, 50, 50))

    draw.line([(60, 380), (width - 60, 380)], fill=(200, 180, 150), width=1)

    # Section 1: Title & Ownership
    draw.text((70, 410), "TITLE & OWNERSHIP DETAILS / भूस्वामी का विवरण", fill=(120, 50, 20))
    
    # Table Header Box
    draw.rectangle([(60, 445), (width - 60, 485)], fill=(240, 230, 210), outline=(150, 120, 80), width=2)
    draw.text((80, 455), "Field Description (विवरण)", fill=(50, 30, 10))
    draw.text((450, 455), "Official Registry Record (पंजीकृत विवरण)", fill=(50, 30, 10))

    # Table Rows
    fields = [
        ("Owner Name (मालिक / खातेदार का नाम):", "Parv Jain s/o Jagrit Bansal"),
        ("Khasra Number (खसरा संख्या):", "128/3"),
        ("Khata / Khatouni Number (खाता संख्या):", "KH-442"),
        ("Total Plot Area (क्षेत्रफल / रकबा):", "2.10 Hectares (5.18 Acres)"),
        ("Land Classification (भूमि की श्रेणी):", "Agricultural (कृषि भूमि)"),
        ("Land Revenue Tax (लगान / कर):", "Rs. 185.50 per annum"),
        ("Dispute / Encumbrance (विवाद स्थिति):", "Clear (ऋण मुक्त / विवाद रहित)"),
    ]

    y = 485
    for label, val in fields:
        draw.rectangle([(60, y), (width - 60, y + 45)], outline=(180, 150, 120), width=1)
        draw.text((80, y + 12), label, fill=(40, 40, 40))
        draw.text((450, y + 12), val, fill=(10, 20, 80))
        y += 45

    # Boundary Details
    y += 30
    draw.text((70, y), "BOUNDARIES / चौहद्दी (SURVEY COORDINATES):", fill=(120, 50, 20))
    y += 30
    draw.rectangle([(60, y), (width - 60, y + 110)], fill=(248, 245, 235), outline=(180, 150, 120), width=1)
    draw.text((80, y + 15), "North (उत्तर): Khasra 128/2 (Panchayat Canal Road)", fill=(60, 60, 60))
    draw.text((80, y + 38), "South (दक्षिण): Khasra 128/4 (Agricultural Land of Ramesh Kumar)", fill=(60, 60, 60))
    draw.text((80, y + 61), "East (पूर्व): Gram Sabha Boundary Pillar No. 4", fill=(60, 60, 60))
    draw.text((80, y + 84), "West (पश्चिम): Irrigation Canal (नहर) & Chak Road", fill=(60, 60, 60))

    # Certification Paragraph
    y += 140
    cert_text = (
        "CERTIFICATE OF TITLE & REVENUE OCCUPANCY:\n"
        "Certified that the above land record particulars have been extracted from the official Jamabandi / Form 7/12\n"
        "cadastral register maintained under the Haryana Land Revenue Act. The vendor / landholder holds legitimate\n"
        "freehold agricultural title over Khasra 128/3 with registered area of 2.10 Hectares."
    )
    draw.text((70, y), cert_text, fill=(50, 50, 50))

    # Official Stamps and Signatures
    y += 130
    # Stamp 1: Revenue Seal
    draw.ellipse([(90, y), (270, y + 90)], outline=(180, 30, 30), width=3)
    draw.text((120, y + 25), "TEHSILDAR OFFICE", fill=(180, 30, 30))
    draw.text((125, y + 45), "GURUGRAM SADAR", fill=(180, 30, 30))
    draw.text((130, y + 65), "★ VERIFIED ★", fill=(180, 30, 30))

    # Stamp 2: Sub-Registrar
    draw.rectangle([(360, y + 10), (560, y + 80)], outline=(30, 60, 150), width=2)
    draw.text((385, y + 25), "SUB-REGISTRAR", fill=(30, 60, 150))
    draw.text((395, y + 48), "REGISTRATION DEPT", fill=(30, 60, 150))

    # Signature line
    draw.line([(width - 290, y + 60), (width - 80, y + 60)], fill=(40, 40, 40), width=2)
    draw.text((width - 270, y + 68), "Authorized Revenue Officer", fill=(50, 50, 50))
    draw.text((width - 240, y + 88), "(Tehsildar / Patwari)", fill=(90, 90, 90))

    # Footer barcode / security hash
    draw.line([(60, height - 80), (width - 60, height - 80)], fill=(180, 150, 120), width=1)
    draw.text((70, height - 65), "Digital Security Hash: SHA256:7f4a2109bc834de1093f4389e1a2b3c4d5e6f7a8b9c0d1e2f3a", fill=(100, 100, 100))
    draw.text((70, height - 45), "BhoomiIntelli Intelligent Land Digitization System | SIH Problem Statement 26018", fill=(120, 120, 120))

    image.save(output_path, "PNG")
    print(f"Sample land document generated successfully at: {output_path}")

def generate_sample_hindi_deed(output_path: str):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    width = 1000
    height = 1400
    image = Image.new("RGB", (width, height), color=(254, 252, 245))
    draw = ImageDraw.Draw(image)

    draw.rectangle([(20, 20), (width - 20, height - 20)], outline=(140, 90, 40), width=4)
    draw.rectangle([(26, 26), (width - 26, height - 26)], outline=(200, 160, 100), width=2)

    draw.text((width // 2 - 150, 60), "राजस्व परिषद उत्तर प्रदेश / हरियाणा", fill=(140, 40, 20))
    draw.text((width // 2 - 120, 95), "प्रपत्र-11 : विक्रय पत्र (SALE DEED)", fill=(30, 30, 30))
    draw.line([(60, 140), (width - 60, 140)], fill=(180, 140, 90), width=2)

    draw.text((70, 170), "विलेख संख्या: SD-2026-98124", fill=(50, 50, 50))
    draw.text((650, 170), "दिनांक: 15/08/2026", fill=(50, 50, 50))
    draw.text((70, 205), "जिला: Rewari (रेवाड़ी)", fill=(50, 50, 50))
    draw.text((650, 205), "तहसील: Rewari Rural", fill=(50, 50, 50))
    draw.text((70, 240), "ग्राम: Dharuhera (धारूहेड़ा)", fill=(50, 50, 50))

    draw.line([(60, 280), (width - 60, 280)], fill=(200, 180, 150), width=1)

    fields = [
        ("Owner Name / क्रेता का नाम:", "Mahesh Yadav"),
        ("Vendor / विक्रेता का नाम:", "Harpal Singh s/o Ramkishan"),
        ("Khasra Number / खसरा संख्या:", "92/1"),
        ("Khata Number / खाता संख्या:", "KH-198"),
        ("Plot Area / कुल क्षेत्रफल:", "3.10 Acres (3.10 एकड़)"),
        ("Land Type / भूमि उपयोग:", "Commercial / Mixed (मिश्रित भूमि)"),
        ("Sale Value / प्रतिफल धनराशि:", "Rs. 45,00,000/- (Forty Five Lakhs Only)"),
        ("Stamp Duty Paid / अदा स्टाम्प शुल्क:", "Rs. 3,15,000/-"),
    ]

    y = 310
    draw.rectangle([(60, y), (width - 60, y + 40)], fill=(235, 225, 205), outline=(160, 120, 80), width=2)
    draw.text((80, y + 10), "विलेख विवरण (Particulars of Deed)", fill=(40, 30, 10))
    draw.text((450, y + 10), "पंजीकृत अभिलेख (Registered Record)", fill=(40, 30, 10))

    y += 40
    for label, val in fields:
        draw.rectangle([(60, y), (width - 60, y + 42)], outline=(190, 160, 130), width=1)
        draw.text((80, y + 10), label, fill=(50, 50, 50))
        draw.text((450, y + 10), val, fill=(15, 25, 90))
        y += 42

    y += 50
    draw.text((70, y), "SUB-REGISTRAR DECLARATION & AUDIT NOTE:", fill=(140, 40, 20))
    y += 30
    draw.text((70, y), "This deed of conveyance has been duly presented for registration by the parties.\n"
                      "Mutation of Khasra 92/1 is subject to revenue inspector field verification and\n"
                      "no-objection verification from co-sharers in Khata KH-198.", fill=(60, 60, 60))

    # Stamps
    y += 120
    draw.ellipse([(100, y), (280, y + 90)], outline=(180, 40, 40), width=3)
    draw.text((130, y + 25), "REGISTRAR OFFICE", fill=(180, 40, 40))
    draw.text((140, y + 45), "REWARI (HARYANA)", fill=(180, 40, 40))
    draw.text((145, y + 65), "★ REGISTERED ★", fill=(180, 40, 40))

    draw.line([(width - 290, y + 60), (width - 80, y + 60)], fill=(40, 40, 40), width=2)
    draw.text((width - 260, y + 68), "Sub-Registrar Officer", fill=(50, 50, 50))

    draw.line([(60, height - 80), (width - 60, height - 80)], fill=(180, 150, 120), width=1)
    draw.text((70, height - 60), "Security Fingerprint: SHA256:d8578edf8458ce06fbc5bb76a58c5ca4ff5e917d235c3c0ef2562479e51c8a14", fill=(100, 100, 100))

    image.save(output_path, "PNG")
    print(f"Sample Hindi deed generated successfully at: {output_path}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    samples_dir = os.path.join(base_dir, "sample_documents")
    
    doc1 = os.path.join(samples_dir, "sample_khasra_khatouni_parv_jain.png")
    doc2 = os.path.join(samples_dir, "sample_sale_deed_mahesh_yadav.png")
    
    generate_sample_land_record(doc1)
    generate_sample_hindi_deed(doc2)
