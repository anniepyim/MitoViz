data <- read.table("output.txt", header=TRUE, sep="\t")

library(scatterplot3d)
library(ggbiplot)
library(ggplot2)

# PCA + 3D scatter plot for All functions
log2fold.all.mito <- data[,3:length(data)]
pca <- prcomp(t(log2fold.all.mito))
#outputname <- paste(titletext,"_AllFunction",".png", sep="")
#png(outputname)
s3d <- scatterplot3d(pca$x[,1:3], pch=19, color="red")
s3d.coords <- s3d$xyz.convert(pca$x[,1:3])
text(s3d.coords$x, s3d.coords$y, labels = colnames(log2fold.all.mito),pos = 3,offset = 0.5, cex=0.5)
mtext(paste(titletext,"All Functions"))
#legend("bottomright", inset = c(0,0), cex = 0.8, bty = "n", legend = cancertypes, text.col = colors[1:length(cancertypes)], col = colors[1:length(cancertypes)], pch = c(16,16))
#dev.off()

#subsetdata <- data[,c("TCGA.BH.A0B3","TCGA.BH.A0E0","TCGA.BH.A18V","TCGA.BH.A1EW","TCGA.BH.A0BM","TCGA.BH.A0HK","TCGA.BH.A0DV","TCGA.BH.A0E1")]

# PCA + 3D scatter plot for each functions
mitofunc <- levels(data[,2])
for(i in 1:length(mitofunc)){
  if (mitofunc[i] != "Pyruvate"){
    subsetdata <- subset(data, process==mitofunc[i])[,3:length(data)]
    pca <- prcomp(t(subsetdata),scale.=TRUE, center=TRUE)
    #outputname <- paste(titletext,"_",mitofunc[i],".png", sep="")
    #png(outputname)
    s3d <- scatterplot3d(pca$x[,1:3], pch=19, color="red")
    s3d.coords <- s3d$xyz.convert(pca$x[,1:3])
    text(s3d.coords$x, s3d.coords$y, labels = colnames(subsetdata),pos = 3,offset = 0.5, cex=0.5)
    mtext(mitofunc[i])
    #legend("bottomright", inset = c(0,0), cex = 0.8, bty = "n", legend = cancertypes, text.col = colors[1:length(cancertypes)],col = colors[1:length(cancertypes)], pch = c(16,16))
    #dev.off()
  }
}

