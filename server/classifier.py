from sklearn import datasets
import sklearn.svm

digits=datasets.load_digits()

data=digits['images']
target=digits['target']

shaped_data=data.reshape((len(data),64))

clf=sklearn.svm.SVC(kernel='linear')
clf.fit(shaped_data,target)

print(__name__)