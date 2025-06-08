import os

dir_path = os.path.dirname(os.path.realpath(__file__))
toOpen = ["high contrast cards", "regular cards"]


values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
suits = ["Heart", "Club", "Diamond", "Spade"]

for folder in toOpen:
    folder_path = os.path.join(dir_path, folder)
    print(f"Processing folder: {folder}")
    
    
    for i in range(52):
        
        suit_index = i // 13  
        value_index = i % 13   
        
        old_name = f"tile{i:03d}.png"  
        new_name = f"{suits[suit_index]}-{values[value_index]}.png"
        
        old_path = os.path.join(folder_path, old_name)
        new_path = os.path.join(folder_path, new_name)
        
        if os.path.exists(old_path):
            os.rename(old_path, new_path)
            print(f"Renamed {old_name} → {new_name}")
        else:
            print(f"Missing card: {old_name}")

print("All cards renamed successfully!")