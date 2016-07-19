data <- read.table("../R-input.txt", header=TRUE, sep="\t",check.names=FALSE)

# PCA
log2fold.all.mito <- data[,3:length(data)]
pca <- prcomp(t(log2fold.all.mito))
sampleID <- rownames(pca$x[,1:3])
sum <- cbind(sampleID, pca$x[,1:3])
write.table(sum, file ="../pcas/All Processes-pca.txt", sep="\t", quote=FALSE, row.names=FALSE)

# PCA for each functions
mitofunc <- levels(data[,2])
for(i in 1:length(mitofunc)){
  subsetdata <- subset(data, process==mitofunc[i])[,3:length(data)]
  if (nrow(subsetdata) >= 3){
    pca <- prcomp(t(subsetdata),scale.=TRUE, center=TRUE)
    sampleID <- rownames(pca$x[,1:3])
    sum <- cbind(sampleID, pca$x[,1:3])
    outputname <- paste("../pcas/",mitofunc[i],"-pca.txt", sep="")
    write.table(sum, file = outputname, sep="\t", quote=FALSE, row.names=FALSE)
  }
}

