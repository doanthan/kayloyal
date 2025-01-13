import csv
import math
import os
import random
import sys


def get_filesize_in_mb(filename, filepath='./'):
    # get file size in MB
    return os.stat('{filepath}{filename}'.format(filepath=filepath,filename=filename)).st_size/1000/1000


def get_num_rows_in_file(filepath, filename, file_ext):
    num_rows_in_file = 0
    with open(filepath+filename+file_ext, 'rb') as csvfileIn:
        num_rows_in_file = sum(1 for _ in csvfileIn)
    return num_rows_in_file


def get_rows_per_filesize_in_mb(filename, num_rows_in_file, filepath='./', target_filesize_in_mb=45):
    # gets the number of rows needed to hit a file size in MB
    return num_rows_in_file / get_filesize_in_mb(filename, filepath=filepath) * target_filesize_in_mb


# Add a random sample segment tag to each row in a CSV
def assign_random_sample_segments(filename, filepath='./', sample_size=1000):
    fileparts = os.path.splitext(filename)
    filename = fileparts[0]
    file_ext = fileparts[1]

    fid = open(filepath+filename+file_ext, "r")
    csv_lines = fid.readlines()
    fid.close()
    # Grab header before shuffle
    header = 'Sample Segment,'+csv_lines.pop(0)
    # Shuffle rows
    random.shuffle(csv_lines)
    # Loop through lines and add current segment number
    sample_segment = 0
    counter = 0
    for row in range(0,len(csv_lines)):
        csv_lines[row] = str(sample_segment)+','+csv_lines[row]
        counter = counter + 1
        if counter == sample_size:
            counter = 0
            sample_segment = sample_segment + 1
    # Save to new file
    fid = open(filepath+filename+'_random_sample_segments'+file_ext, "w")
    fid.writelines([header]+csv_lines)
    fid.close()
    return filename+'_random_sample_segments'


# return the number of rows to split the CSV by given the desired filesize
def split_csv(filename, filepath='./', target_filesize_in_mb=45, delimiter=','):
    print('Calulating file metrics...')
    fileparts = os.path.splitext(filename)
    filename = fileparts[0]
    file_ext = fileparts[1]
    file_size = get_filesize_in_mb(filename+file_ext, filepath=filepath)
    num_rows_in_file = get_num_rows_in_file(filepath=filepath, filename=filename, file_ext=file_ext)
    with open(filepath+filename+file_ext, 'r', encoding="ISO-8859-1") as csvfileIn:
        reader = csv.reader(csvfileIn, delimiter=delimiter)
        row_limit = get_rows_per_filesize_in_mb(
            filename+file_ext, filepath=filepath,
            target_filesize_in_mb=target_filesize_in_mb,
            num_rows_in_file=num_rows_in_file
        )
        num_files = math.ceil(num_rows_in_file / row_limit)
        print('| Original File Size: ' +str(file_size)+ 'MB | Target File Size: ' +str(target_filesize_in_mb)+ 'MB | \n' +
              '| Original File Row Count: ' +str(num_rows_in_file)+ ' Rows | Target File Row Count: ' +str(row_limit)+ ' Rows | \n' +
              '| Number of Output Files: ' +str(num_files)+ ' |')
        current_part = 1
        writer = csv.writer(open(filepath+filename+'_part'+str(current_part)+file_ext, 'w'), delimiter=delimiter)
        current_limit = row_limit
        print('Processing file part: ' + str(current_part) + ' out of ' + str(num_files))
        headers = next(reader)
        writer.writerow(headers)
        for i, row in enumerate(reader):
            if i + 1 > current_limit:
                current_part += 1
                print('Processing file part: ' + str(current_part) + ' out of ' + str(num_files))
                current_limit = row_limit * current_part
                writer = csv.writer(open(filepath+filename+'_part'+str(current_part)+file_ext, 'w'), delimiter=delimiter)
                writer.writerow(headers)
            # Get rid of nulls
            row = [col if col.lower() != "null" else "" for col in row]
            writer.writerow(row)

# Hardcoded inputs
filepath = './'
filename = 'name_of_your_csv_file.csv'

# Get command-line inputs if they exist
sys.argv.pop(0)
for arg_idx in range(len(sys.argv)):
    if sys.argv[arg_idx] == '-fn' and sys.argv[arg_idx+1]:
        filename = sys.argv[arg_idx+1]
        print('Filename: ' + sys.argv[arg_idx+1])
    elif sys.argv[arg_idx] == '-fp' and sys.argv[arg_idx+1]:
        print('Filepath: ' + sys.argv[arg_idx+1])
        filepath = sys.argv[arg_idx+1]

fileparts = os.path.splitext(filename)
filename = fileparts[0]
file_ext = fileparts[1]

#filename = assign_random_sample_segments(filename+file_ext, filepath=os.path.expanduser(filepath), sample_size=1000)

split_csv(filename=filename+file_ext, filepath=os.path.expanduser(filepath), target_filesize_in_mb=45, delimiter=',')
