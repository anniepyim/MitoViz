#!/usr/bin/env Rscriptlen
library(jsonlite)


args = commandArgs(trailingOnly=TRUE)

if (length(args)==0) {
  #stop("At least one argument must be supplied (input file).n", call.=FALSE)
  filelist = c("TCGA-BH-A0B3.json","TCGA-BH-A0BM.json","TCGA-BH-A0E0.json","TCGA-BH-A0HK.json")
} else if (length(args)>=1) {
  filelist = args[1:length(args)]
}

targetoutpath = "data/PCA/"

if (exists("merged")) rm(merged)
if (exists("url")) rm(url)

for (file in filelist){

  test <- fromJSON(file)
  sampleID <- test[1,"sampleID"]
  
  # if the merged dataset doesn't exist, create it
  if (!exists("merged")){
    merged <- test[,c("gene","process","log2")]
    colnames(merged) <- c("gene","process",sampleID)
    url <- c(sampleID,file)
  }
  
  # if the merged dataset does exist, append to it
  else if (exists("merged")){
    test <- test[,c("gene","log2")]
    colnames(test) <- c("gene",sampleID)
    merged <- (merge(merged, test, by = 'gene'))
    url <- rbind(url,c(sampleID,file))
  }
}

colnames(url) <- c("sampleID","url")
data <- merged[!duplicated(merged[1:2]),]
clinical <- read.table("clinical-modified.txt",header=TRUE,sep="\t",check.names="FALSE")
clin <- clinical[,c("sampleID","Cancer_type","Gender","Pathologic_stage")]
colnames(clin) <- c("sampleID","group","gender","stage")

# PCA
log2fold.all.mito <- data[,3:length(data)]
pca <- prcomp(t(log2fold.all.mito))
sampleID <- rownames(pca$x[,1:3])
sum <- cbind(sampleID, pca$x[,1:3])
rownames(sum) <- NULL
sum <- as.data.frame(sum)
df<- merge(sum,clin,by="sampleID")
df<- merge(df,url,by="sampleID")
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
    pca <- prcomp(t(subsetdata),scale.=TRUE, center=TRUE)
    sampleID <- rownames(pca$x[,1:3])
    sum <- cbind(sampleID, pca$x[,1:3])
    rownames(sum) <- NULL
    sum <- as.data.frame(sum)
    df<- merge(sum,clin,by="sampleID")
    df<- merge(df,url,by="sampleID")
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