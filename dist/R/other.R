#!/usr/bin/env Rscriptlen
library(jsonlite)


args = commandArgs(trailingOnly=TRUE)
targetoutpath = "../data/PCA/"

if (length(args)==0) {
  #stop("At least one argument must be supplied (input file).n", call.=FALSE)
  filelist = c("test/TCGA-BH-A0B3.json","test/TCGA-BH-A0BM.json","test/TCGA-BH-A0E0.json","test/TCGA-BH-A0HK.json")
} else if (length(args)>=1) {
  filelist = args[1:length(args)]
}

datalist = lapply(filelist,function(x){
  test <- fromJSON(x)
  sampleID <- test[1,"sampleID"]
  test <- test[,c("gene","process","log2")]
  test[,3] <- round(test[,3],3)
  colnames(test) <- c("gene","process",sampleID)
  test
})

data = Reduce(function(x,y) {
  merge(x,y)
}, datalist)


url = do.call("rbind", lapply(filelist,function(x){
  test <- fromJSON(x)
  sampleID <- test[1,"sampleID"]
  c(sampleID,substring(x,2))
}))

colnames(url) <- c("sampleID","url")

# PCA
log2fold.all.mito <- data[,3:length(data)]
pca <- prcomp(t(log2fold.all.mito))
sampleID <- rownames(pca$x[,1:3])
sum <- cbind(sampleID, pca$x[,1:3])
rownames(sum) <- NULL
sum <- as.data.frame(sum)
df<- merge(sum,url,by="sampleID")
df$PC1 <- as.numeric(as.character(df$PC1))
df$PC2 <- as.numeric(as.character(df$PC2))
df$PC3 <- as.numeric(as.character(df$PC3))

dfjsonall <- toJSON(df)
outputname <- paste(targetoutpath,"All Processes-pca.json", sep="")
write(dfjsonall,outputname)

# PCA for each functions
mitofunc <- unique(data[,"process"])
for(i in 1:length(mitofunc)){
  subsetdata <- subset(data, process==mitofunc[i])[,3:length(data)]
  if (nrow(subsetdata) >= 3){
    pca <- prcomp(t(subsetdata))
    sampleID <- rownames(pca$x[,1:3])
    sum <- cbind(sampleID, pca$x[,1:3])
    rownames(sum) <- NULL
    sum <- as.data.frame(sum)
    df<- merge(sum,url,by="sampleID")
    df$PC1 <- as.numeric(as.character(df$PC1))
    df$PC2 <- as.numeric(as.character(df$PC2))
    df$PC3 <- as.numeric(as.character(df$PC3))
    dfjson <- toJSON(df)
    outputname <- paste(targetoutpath,mitofunc[i],"-pca.json", sep="")
    write(dfjson,outputname)
  }
}

# Just for converting previous files into appropriate jsons
#for(i in 3:length(all)){
#  test <- all[,c(1,i)]
#  sampleID <- colnames(test)[2]
#  colnames(test) <- c("gene","log2")
#  merged <- (merge(test, genefunc, by = 'gene'))
#  Normal <- rep("0",nrow(merged))
#  Abnormal <- rep("0",nrow(merged))
#  pvalue <- rep("0",nrow(merged))
#  mutation <- rep("",nrow(merged))
#  sampleID <- rep(sampleID,nrow(merged))
#  final <- cbind(merged,sampleID,Normal,Abnormal,pvalue,mutation)
#  dfjson <- toJSON(final)
#  outputname <- paste("test/",sampleID[1],".json", sep="")
#  write(dfjson,outputname)
#}



